import React, { useState } from 'react';
import { api } from '../services/api';

export default function PdfDownloadButton({ targetId, filename }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        setError(null);
        setLoading(true);

        try {
            // Find the element to convert
            const element = document.getElementById(targetId);
            if (!element) throw new Error("Content not found on page.");

            // Get the outerHTML
            // In a real app we'd inject Tailwind CSS styles here or rely on the backend to apply them
            // For this hackathon, we'll prefix basic styles so xhtml2pdf renders it tolerably.
            const htmlContent = `
        <html>
        <head>
          <style>
             body { font-family: Helvetica, sans-serif; color: #333; margin: 20px; }
             h2 { color: #500000; font-size: 24px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
             h3 { color: #500000; font-size: 18px; margin-top: 20px;}
             h4 { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
             p { font-size: 12px; line-height: 1.5; }
             li { font-size: 12px; line-height: 1.5; margin-bottom: 4px; }
             .bg-amber-50 { background-color: #fffbeb; padding: 15px; border: 1px solid #fcd34d; }
             .text-amber-900 { color: #78350f; }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
        </html>
      `;

            const pdfBlob = await api.generatePdf(htmlContent);

            // Create a temporary link to download the blob
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || 'InterviewIQ_Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("PDF generation failed:", err);
            setError(err.message || 'Failed to generate PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inline-flex flex-col items-end">
            <button
                onClick={handleDownload}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-maroon-700 hover:border-maroon-300 active:scale-95'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating PDF...
                    </span>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download PDF
                    </>
                )}
            </button>
            {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
        </div>
    );
}
