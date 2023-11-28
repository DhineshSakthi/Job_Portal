import React, { useEffect, useState } from 'react';

const ResumeViewer = ({ resumePath }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/uploads/${resumePath}`);
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, [resumePath]);

  const downloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'resume.pdf';
      a.click();
    }
  };

  return (
    <div>
      <iframe
        title="Resume"
        src={pdfUrl}
        width="100%"
        height="400px"
      />
      <button onClick={downloadPdf}>Download PDF</button>
    </div>
  );
};

export default ResumeViewer;


