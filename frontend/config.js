// config.js
// This file holds the API base URL so we don't have to change it in multiple files.

// For local testing:
// const API_BASE_URL = 'https://staffassist.onrender.com/api';

// For production (Render):
const API_BASE_URL = 'https://staffassist.onrender.com/api'; // Replace with your actual Render URL later!

// If this is used as a module in the browser, export it. Otherwise, it will exist in the global scope if included via <script>
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
