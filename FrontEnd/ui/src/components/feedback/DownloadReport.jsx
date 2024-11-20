import React from 'react';

const DownloadReport = () => {
  const downloadCSV = async () => {
    try {
      // Fetch the CSV from the backend
      const response = await fetch('http://localhost:8070/report', {
        method: 'GET',
        headers: {
          'Content-Type': 'text/csv',
        },
      });

      if (response.ok) {
        // Get the filename from the headers (optional)
        const filename = response.headers.get('content-disposition')
          ? response.headers.get('content-disposition').split('filename=')[1]
          : 'feedback_report.csv';

        // Convert the response to blob
        const blob = await response.blob();

        // Create a link to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // Append link to body and trigger click
        document.body.appendChild(link);
        link.click();

        // Remove the link after downloading
        document.body.removeChild(link);
      } else {
        console.error('Failed to fetch the report');
      }
    } catch (err) {
      console.error('Error downloading the CSV:', err);
    }
  };

  return (
    <div>
      <button onClick={downloadCSV}>Download Feedback Report</button>
    </div>
  );
};

export default DownloadReport;
