import React from 'react';

export default function IntervieweePacket({ session }) {
    const packet = session?.intervieweePacket || {};

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-maroon-600 pl-3">
                    Company Profile: {session.companyName}
                </h2>
                <p className="text-sm text-gray-500 mt-1 pl-4">Prepared automatically by InterviewIQ AI</p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
                <section>
                    <h3 className="text-lg font-bold text-maroon-700 mb-3">Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {packet.company_profile?.overview || 'Overview data not available.'}
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-maroon-700 mb-3">Recent Context</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-gray-700">
                        {(packet.company_profile?.recent_news || []).map((news, i) => (
                            <li key={i}>{news}</li>
                        ))}
                    </ul>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-green-50 rounded-lg p-5 border border-green-100">
                        <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Key Strengths
                        </h3>
                        <ul className="space-y-2">
                            {(packet.company_profile?.key_strengths || []).map((s, i) => (
                                <li key={i} className="text-sm text-green-900">{s}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-orange-50 rounded-lg p-5 border border-orange-100">
                        <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Potential Weaknesses
                        </h3>
                        <ul className="space-y-2">
                            {(packet.company_profile?.potential_weaknesses || []).map((w, i) => (
                                <li key={i} className="text-sm text-orange-900">{w}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
