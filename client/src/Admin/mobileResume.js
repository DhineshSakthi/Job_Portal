import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MobileResumeViewer = ({ resumePath }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadPdf = () => {
    const a = document.createElement('a');
    a.href = `/uploads/${resumePath}`; 
    a.download = 'resume.pdf'; 
    a.click();
  };

  return (
    <div>
      <Document
        file={`/uploads/${resumePath}`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} width={300} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button
        onClick={() => {
          if (pageNumber > 1) setPageNumber(pageNumber - 1);
        }}
      >
        Previous
      </button>
      <button
        onClick={() => {
          if (pageNumber < numPages) setPageNumber(pageNumber + 1);
        }}
      >
        Next
      </button>
      <button onClick={downloadPdf}>Download PDF</button> {/* Add a "Download PDF" button */}
    </div>
  );
};

export default MobileResumeViewer;
