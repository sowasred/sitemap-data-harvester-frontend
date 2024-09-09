import React, { useState } from 'react';
import axios from 'axios';

function SitemapExtractor() {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [status, setStatus] = useState('');

  const validateSitemap = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/validate-sitemap', { url: sitemapUrl });
      setIsValidUrl(response.data.isValid);
      setStatus(response.data.isValid ? 'Valid sitemap URL' : 'Invalid sitemap URL');
    } catch (error) {
      setStatus('Error validating sitemap');
    }
  };

  const extractContent = async () => {
    setIsExtracting(true);
    setStatus('Extracting content...');
    try {
      const response = await axios.post('http://localhost:5001/api/extract-content', { url: sitemapUrl });
      setStatus(`Extraction complete. ${response.data.totalPages} pages processed.`);
    } catch (error) {
      setStatus('Error extracting content');
    }
    setIsExtracting(false);
  };

  const downloadContent = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/download-content', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'combined_content.txt');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setStatus('Error downloading content');
    }
  };

  return (
    <div className="container">
      <h1>Sitemap Content Extractor</h1>
      <input
        type="text"
        value={sitemapUrl}
        onChange={(e) => setSitemapUrl(e.target.value)}
        placeholder="Enter sitemap URL"
      />
      <button onClick={validateSitemap}>Validate URL</button>
      <button onClick={extractContent} disabled={!isValidUrl || isExtracting}>
        Start Extraction
      </button>
      <button onClick={downloadContent} disabled={!isValidUrl || isExtracting}>
        Download All Content
      </button>
      <div id="status">{status}</div>
    </div>
  );
}

export default SitemapExtractor;