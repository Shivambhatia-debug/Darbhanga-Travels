// API Configuration for Production
// This file should be included in the frontend to fix API calls

const API_BASE_URL = 'https://darbhangatravels.com/api';

// Override fetch to use full URLs
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  // If it's a relative API URL, make it absolute
  if (url.startsWith('/api/')) {
    url = API_BASE_URL + url.substring(4); // Remove '/api' and add full URL
  }
  return originalFetch(url, options);
};

console.log('API configuration loaded - using full URLs for API calls');





















