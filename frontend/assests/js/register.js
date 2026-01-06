document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alert = document.getElementById('regAlert');
    
    const employeeId = document.getElementById('regEmpId').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (password !== confirm) {
        alert.className = "alert alert-danger";
        alert.textContent = "Passwords do not match!";
        alert.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/set-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert.className = "alert alert-success";
            alert.textContent = "Account activated! Redirecting to login...";
            alert.classList.remove('d-none');
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            alert.className = "alert alert-danger";
            alert.textContent = data.message || "Activation failed";
            alert.classList.remove('d-none');
        }
    } catch (error) {
        alert.className = "alert alert-danger";
        alert.textContent = "Server error. Check your connection.";
        alert.classList.remove('d-none');
    }
});