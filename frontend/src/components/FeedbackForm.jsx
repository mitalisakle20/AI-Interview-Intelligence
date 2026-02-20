import React, { useState } from 'react';
import { api } from '../services/api';

export default function FeedbackForm({ sessionId, suggestedQuestions, onFeedbackSubmitted }) {
    const [corrections, setCorrections] = useState('');
    const [selectedQs, setSelectedQs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleToggleQuestion = (index) => {
        if (selectedQs.includes(index)) {
            setSelectedQs(selectedQs.filter((i) => i !== index));
        } else {
            if (selectedQs.length >= 3) {
                setError("You can only select up to 3 questions.");
                return;
            }
            setError(null);
            setSelectedQs([...selectedQs, index]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedQs.length === 0) {
            setError("Please select at least 1 question to discuss.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // Map indices back to the actual question objects/strings to send to backend
            const selectedContent = selectedQs.map(i => suggestedQuestions[i]);
            await api.submitFeedback(sessionId, corrections, selectedContent);
            onFeedbackSubmitted();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-maroon-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-maroon-700"></div>

            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-900">Your Feedback & Preferences</h2>
                <p className="text-gray-600 mt-2 text-sm">
                    Please review the AI profile above. Enter any corrections below, and choose the top 2-3 questions you'd like to focus on during our conversation.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200 font-medium">
                        {error}
                    </div>
                )}

                {/* Corrections block */}
                <section>
                    <label className="block text-base font-bold text-gray-900 mb-2">
                        Corrections or Clarifications (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Notice anything wrong in the AI summary? Let us know so we're on the same page.</p>
                    <textarea
                        value={corrections}
                        onChange={(e) => setCorrections(e.target.value)}
                        disabled={loading}
                        rows={4}
                        placeholder="e.g. We actually pivoted away from the mobile app project last quarter..."
                        className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-600 outline-none transition-all disabled:bg-gray-100 text-sm md:text-base resize-y"
                    />
                </section>

                {/* Question Selection */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <label className="block text-base font-bold text-gray-900">
                                Preferred Discussion Topics <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Select 1 to 3 questions.</p>
                        </div>
                        <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {selectedQs.length} / 3 Selected
                        </div>
                    </div>

                    <div className="space-y-3">
                        {suggestedQuestions.map((q, idx) => {
                            const checked = selectedQs.includes(idx);
                            const disabled = !checked && selectedQs.length >= 3;

                            return (
                                <label
                                    key={idx}
                                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${checked ? 'border-maroon-600 bg-maroon-50/30' :
                                            disabled ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' :
                                                'border-gray-200 hover:border-maroon-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => !disabled && handleToggleQuestion(idx)}
                                            disabled={loading || disabled}
                                            className="w-6 h-6 text-maroon-600 border-gray-300 rounded focus:ring-maroon-600"
                                        />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-lg ${checked ? 'text-maroon-900' : 'text-gray-900'}`}>
                                            {q.question}
                                        </h4>
                                        <p className="mt-2 text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-300 pl-3">
                                            "Why this matters: {q.rationale}"
                                        </p>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading || selectedQs.length === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-md mt-4 ${loading || selectedQs.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-maroon-700 hover:bg-maroon-600 hover:shadow-lg active:scale-95 text-white'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit Interface Preferences'}
                </button>
            </form>
        </div>
    );
}
