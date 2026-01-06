// frontend/assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // The base URL for your Express backend
    const API_URL = 'http://localhost:3000/api/auth/login';

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission and page reload
            loginError.classList.add('d-none'); // Hide previous errors

            // 1. Collect form data
            const employeeId = document.getElementById('employeeId').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!employeeId || !password) {
                loginError.textContent = 'Please enter both ID and password.';
                loginError.classList.remove('d-none');
                return;
            }

            // 2. Prepare request body
            const requestBody = { employeeId, password };

            try {
                // 3. Send POST request to the backend API
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();

                // 4. Handle response
                if (response.ok) {
                    // Successful login!
                    // Store the token for future API calls
                    localStorage.setItem('staffToken', data.token);
                    localStorage.setItem('employeeId', data.employeeId);
                    
                    // Redirect to the dashboard
                    window.location.href = 'employee-dashboard.html';
                } else {
                    // Login failed (e.g., 401 Unauthorized, 400 Bad Request)
                    const errorMessage = data.message || 'Login failed due to network error.';
                    loginError.textContent = errorMessage;
                    loginError.classList.remove('d-none');
                }

            } catch (error) {
                console.error('Network Error:', error);
                loginError.textContent = 'Could not connect to the server. Check if the backend is running.';
                loginError.classList.remove('d-none');
            }
        });
    }
});