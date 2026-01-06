document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // TOP-LEVEL VARIABLES
    // --------------------------------------------------
    const adminToken = localStorage.getItem('adminToken');
    const API_BASE = 'http://localhost:3000/api';

    const createEmployeeForm = document.getElementById('createEmployeeForm');
    const employeeAlert = document.getElementById('employeeAlert');
    const addAnnouncementForm = document.getElementById('addAnnouncementForm');
    const announcementAlert = document.getElementById('announcementAlert');
    const ticketListContainer = document.getElementById('ticketListContainer');

    // 1. AUTHENTICATION CHECK
    if (!adminToken) {
        alert("Admin session expired or unauthorized. Please log in.");
        window.location.href = 'index.html'; 
        return;
    }

    document.getElementById('adminUserDisplay').textContent = "ITAdmin";

    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = 'index.html';
    });

    // --------------------------------------------------
    // 2. CREATE EMPLOYEE ID LOGIC
    // --------------------------------------------------
    if (createEmployeeForm) {
        createEmployeeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            employeeAlert.classList.add('d-none');
            
            const firstName = document.getElementById('newFirstName').value.trim();
            const lastName = document.getElementById('newLastName').value.trim();
            const email = document.getElementById('newEmail').value.trim();

            try {
                const response = await fetch(`${API_BASE}/admin/employee-id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({ firstName, lastName, email }),
                });

                const data = await response.json();

                if (response.ok) {
                    employeeAlert.innerHTML = `✅ <strong>Success!</strong> ID: <span class="badge bg-dark">${data.employeeId}</span> created for ${firstName}.`;
                    employeeAlert.className = "alert alert-success mt-3";
                    createEmployeeForm.reset();
                } else {
                    employeeAlert.textContent = data.message || "Failed to create ID.";
                    employeeAlert.className = "alert alert-danger mt-3";
                }
                employeeAlert.classList.remove('d-none');
            } catch (error) {
                console.error('Create Employee Error:', error);
            }
        });
    }

    // --------------------------------------------------
    // 3. FETCH ALL TICKETS (The "IT Side" display)
    // --------------------------------------------------
    async function fetchAllTickets() {
        try {
            const response = await fetch(`${API_BASE}/tickets/it-desk`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            const data = await response.json();

            if (data.tickets && data.tickets.length > 0) {
                ticketListContainer.innerHTML = data.tickets.map(ticket => `
                    <div class="card mb-3 border-start border-danger border-4 shadow-sm">
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between">
                                <h6 class="text-danger font-weight-bold">${ticket.id}</h6>
                                <span class="badge bg-secondary">${ticket.status}</span>
                            </div>
                            <p class="mb-1"><strong>Issue:</strong> ${ticket.issueType}</p>
                            <p class="small text-muted mb-1">${ticket.description}</p>
                            <div class="text-end" style="font-size: 0.75rem;">
                                Submitted by: ${ticket.employeeId} | ${new Date(ticket.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                ticketListContainer.innerHTML = '<p class="text-center text-muted mt-3">No active tickets found.</p>';
            }
        } catch (error) {
            ticketListContainer.innerHTML = '<p class="text-danger text-center">Error loading tickets.</p>';
            console.error('Fetch Tickets Error:', error);
        }
    }

    // --------------------------------------------------
    // 4. POST ANNOUNCEMENT
    // --------------------------------------------------
    if (addAnnouncementForm) {
        addAnnouncementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('announcementTitle').value.trim();
            const content = document.getElementById('announcementContent').value.trim();

            try {
                const response = await fetch(`${API_BASE}/admin/announcement`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({ title, content }),
                });

                if (response.ok) {
                    announcementAlert.textContent = "✅ Announcement posted successfully!";
                    announcementAlert.className = "alert alert-success mt-3";
                    announcementAlert.classList.remove('d-none');
                    addAnnouncementForm.reset();
                }
            } catch (error) {
                console.error('Post Announcement Error:', error);
            }
        });
    }

    // Initialize the ticket list on load
    fetchAllTickets();
});