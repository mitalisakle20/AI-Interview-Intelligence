const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://l8xc3yrptf.execute-api.us-west-2.amazonaws.com/dev';

/**
 * Enhanced fetch wrapper for the Backend API
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    // Keep the response around for pdf logic if needed
    if (!response.ok) {
        let errorMsg = `API Error: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.message) errorMsg = errorData.message;
            else if (errorData.error) errorMsg = errorData.error;
        } catch (e) {
            // Ignored
        }
        throw new Error(errorMsg);
    }

    return response;
}

export const api = {
    /**
     * Triggers the AI pipeline to analyze a company.
     */
    async triggerPipeline(companyName, companyUrl) {
        const payload = { companyName };
        if (companyUrl) payload.companyUrl = companyUrl;

        const res = await apiFetch('/pipeline', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return await res.json();
    },

    /**
     * Retrieves an existing session by ID.
     */
    async getSession(sessionId) {
        const res = await apiFetch(`/sessions/${sessionId}`, {
            method: 'GET'
        });
        return await res.json();
    },

    /**
     * Submits interviewee corrections and selected questions.
     */
    async submitFeedback(sessionId, corrections, selectedQuestions) {
        const res = await apiFetch(`/sessions/${sessionId}/feedback`, {
            method: 'POST',
            body: JSON.stringify({ corrections, selectedQuestions })
        });
        return await res.json();
    },

    /**
     * Sends an HTML string to the GeneratePdf Lambda and returns the Base64 result.
     */
    async generatePdf(htmlContent) {
        const res = await apiFetch('/pdf', {
            method: 'POST',
            body: JSON.stringify({ html_content: htmlContent })
        });
        const blob = await res.blob();
        return blob;
    }
};
