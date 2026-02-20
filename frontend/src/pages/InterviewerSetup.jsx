import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function InterviewerSetup() {
    const [companyName, setCompanyName] = useState('');
    const [companyUrl, setCompanyUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyName) {
            setError("Company Name is required.");
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const response = await api.triggerPipeline(companyName, companyUrl);
            if (response && response.executionId) {
                navigate(`/session/${response.executionId}`);
            } else {
                throw new Error("Invalid response format from pipeline");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to trigger pipeline');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-maroon-700 px-6 py-6 text-center">
                    <h2 className="text-2xl font-bold text-white">New Interview Brief</h2>
                    <p className="text-maroon-100 text-sm mt-1">Generate AI intelligence for your upcoming interview.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm ring-1 ring-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Target Company <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Apple Inc, Amazon, GridFlex Energy"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-600 focus:border-maroon-600 outline-none transition-all disabled:bg-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Website (Optional)
                        </label>
                        <input
                            type="url"
                            value={companyUrl}
                            onChange={(e) => setCompanyUrl(e.target.value)}
                            placeholder="https://..."
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-600 focus:border-maroon-600 outline-none transition-all disabled:bg-gray-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-md ${loading
                                ? 'bg-maroon-600/70 cursor-not-allowed'
                                : 'bg-maroon-700 hover:bg-maroon-600 hover:shadow-lg active:transform active:scale-95'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gathering Intelligence...
                            </span>
                        ) : (
                            'Generate Brief'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
