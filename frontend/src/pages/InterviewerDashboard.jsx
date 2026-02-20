import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import BriefView from '../components/BriefView';

export default function InterviewerDashboard() {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let intervalId;

        // Poll the session endpoint to get status updates
        const pollSession = async () => {
            try {
                const data = await api.getSession(id);
                setSession(data);

                // Stop polling if we reached a terminal state
                if (data.status === 'READY' || data.status === 'FEEDBACK_RECEIVED' || data.status === 'FAILED') {
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error("Polling error", err);
                setError("Failed to fetch session. The AI execution may have failed or timed out.");
                clearInterval(intervalId);
            }
        };

        // Initial fetch immediately
        pollSession();

        // Check every 5 seconds
        intervalId = setInterval(pollSession, 5000);

        return () => clearInterval(intervalId);
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">
                    <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-maroon-600 mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">Connecting to Pipeline...</h2>
            </div>
        );
    }

    const isGenerating = session.status !== 'READY' && session.status !== 'FEEDBACK_RECEIVED';

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Ribbon */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-maroon-600 pl-3">
                            {session.companyName}
                        </h1>
                        <div className="mt-2 text-sm text-gray-500 font-mono">
                            Session ID: {id}
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        {isGenerating ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm animate-pulse ring-1 ring-blue-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                AI Generator Running...
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold text-sm ring-1 ring-green-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                Pipeline Complete
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                {isGenerating ? (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-maroon-100 border-t-maroon-600 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Synthesizing Brief...</h2>
                        <p className="text-gray-500 max-w-md mx-auto mt-3">
                            We are scraping the company site, running NLP sentiment analysis, and querying Claude to build your structured interview plan. This typically takes 30-45 seconds.
                        </p>
                    </div>
                ) : (
                    <BriefView session={session} />
                )}

            </div>
        </div>
    );
}
