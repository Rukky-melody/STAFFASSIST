// frontend/assets/js/admin-login.js

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginAlert = document.getElementById('loginAlert');
    loginAlert.classList.add('d-none');

    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;

    try {
        const response = await fetch('http://localhost:3000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // SUCCESS: Store the token automatically!
            localStorage.setItem('adminToken', data.token);
            // Redirect to the dashboard
            window.location.href = 'it-dashboard.html';
        } else {
            loginAlert.textContent = data.message || 'Login failed';
            loginAlert.classList.remove('d-none');
        }
    } catch (error) {
        loginAlert.textContent = 'Server error. Is the backend running?';
        loginAlert.classList.remove('d-none');
    }
});