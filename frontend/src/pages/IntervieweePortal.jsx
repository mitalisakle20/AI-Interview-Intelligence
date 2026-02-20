import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import IntervieweePacket from '../components/IntervieweePacket';
import FeedbackForm from '../components/FeedbackForm';

export default function IntervieweePortal() {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await api.getSession(id);
                setSession(data);
            } catch (err) {
                console.error(err);
                setError("Invalid secure link or session expired.");
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-maroon-600 mb-4"></div>
                <p className="text-gray-600">Loading your profile...</p>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">{error || "Session not found."}</p>
                </div>
            </div>
        );
    }

    // Pre-interview packets need to be generated fully before interviewee is invited
    if (session.status === 'CREATED' || session.status === 'ANALYSIS_COMPLETE') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200 block text-center max-w-lg">
                    <p className="text-orange-700 font-bold mb-2">Still Generating...</p>
                    <p className="text-gray-600">The AI is still compiling this profile. Please refresh in a few seconds.</p>
                </div>
            </div>
        )
    }

    const isComplete = session.status === 'FEEDBACK_RECEIVED';

    return (
        <div className="min-h-screen bg-gray-50 p-4 py-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Pre-Interview Material</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Welcome! To ensure our upcoming conversation is as productive and tailored to your interests as possible, we have used an AI assistant to research <strong>{session.companyName}</strong>.
                        <br /><br />
                        Please review the brief summary below. If the AI missed the mark, or if there are specific strategic directions you would prefer to focus on, use the form at the bottom of the page to let us know.
                    </p>
                </div>

                <IntervieweePacket session={session} />

                {isComplete ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl text-center shadow-sm">
                        <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
                        <p>Your preferences have been securely saved. We look forward to our conversation.</p>
                    </div>
                ) : (
                    <FeedbackForm
                        sessionId={id}
                        suggestedQuestions={session.intervieweePacket?.suggested_questions || []}
                        onFeedbackSubmitted={() => {
                            // Optimistically update UI
                            setSession({ ...session, status: 'FEEDBACK_RECEIVED' })
                        }}
                    />
                )}
            </div>
        </div>
    );
}
