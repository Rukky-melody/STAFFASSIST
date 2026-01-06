// frontend/assets/js/dashboard.js (FINAL, CRASH-RESISTANT CODE)

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // TOP-LEVEL VARIABLES (Visible to all functions/listeners)
    // --------------------------------------------------
    const token = localStorage.getItem('staffToken');
    const employeeId = localStorage.getItem('employeeId');
    const API_BASE = 'http://localhost:3000/api';
    
    // Element Lookups
    const itTicketForm = document.getElementById('itTicketForm');
    const itTicketAlert = document.getElementById('itTicketAlert');
    const hrComplaintForm = document.getElementById('hrComplaintForm');
    const hrComplaintAlert = document.getElementById('hrComplaintAlert');


    // --------------------------------------------------
    // 1. AUTHENTICATION CHECK & DISPLAY
    // --------------------------------------------------
    if (!token || !employeeId) {
        alert("Session expired. Please log in again.");
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('employeeIdDisplay').textContent = employeeId;
    document.getElementById('employeeNameDisplay').textContent = `ID: ${employeeId}`;

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('employeeId');
        window.location.href = 'index.html';
    });


    // --------------------------------------------------
    // 2. FETCH ANNOUNCEMENTS (NOTICE BOARD) FUNCTION
    // --------------------------------------------------
    async function fetchAnnouncements() {
        const url = `${API_BASE}/staff/announcements`;
        const contentDiv = document.getElementById('noticeBoardContent');

        try {
            const response = await fetch(url, {
                method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                contentDiv.innerHTML = `<p class="text-danger">Failed to load announcements: ${response.statusText}</p>`;
                return;
            }

            const data = await response.json();
            
            if (data.announcements && data.announcements.length > 0) {
                contentDiv.innerHTML = data.announcements.map(announcement => `
                    <div class="alert alert-light border-start border-3 border-primary mb-2 shadow-sm">
                        <h6 class="alert-heading text-primary">${announcement.title}</h6>
                        <p class="mb-1">${announcement.content}</p>
                        <hr class="my-1">
                        <p class="mb-0 text-muted small">Posted by: ${announcement.postedBy} on ${new Date(announcement.date).toLocaleDateString()}</p>
                    </div>
                `).join('');
            } else {
                contentDiv.innerHTML = '<p class="text-center text-muted">No current announcements on the Notice Board.</p>';
            }

        } catch (error) {
            contentDiv.innerHTML = `<p class="text-danger">Network error fetching announcements.</p>`;
            console.error('Announcements Fetch Error:', error);
        }
    }
    
    fetchAnnouncements();


    // --------------------------------------------------
    // 3. IT TICKET SUBMISSION LOGIC (Event Listener)
    // --------------------------------------------------
    if (itTicketForm) {
        itTicketForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            itTicketAlert.classList.add('d-none');
            itTicketAlert.classList.remove('alert-success', 'alert-danger');

            const issueType = document.getElementById('issueType').value;
            const description = document.getElementById('ticketDescription').value.trim();

            const requestBody = { issueType, description };
            const url = `${API_BASE}/tickets/it`;

            try {
                const response = await fetch(url, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                
                if (response.ok) {
                    itTicketAlert.textContent = `Success! Ticket ID: ${data.ticketId}`;
                    itTicketAlert.classList.add('alert-success');
                    itTicketAlert.classList.remove('d-none');
                    itTicketForm.reset(); 
                    
                    // FIX: Robust Modal Closing (IT Ticket) - Safely hides the modal
                    setTimeout(() => {
                        const modalElement = document.getElementById('itTicketModal');
                        if (typeof bootstrap !== 'undefined' && bootstrap.Modal && modalElement) {
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            if (modal) modal.hide();
                        }
                        itTicketAlert.classList.add('d-none');
                    }, 2000);
                } else {
                    itTicketAlert.textContent = data.message || 'Ticket submission failed.';
                    itTicketAlert.classList.add('alert-danger');
                    itTicketAlert.classList.remove('d-none');
                }

            } catch (error) {
                itTicketAlert.textContent = 'Network error. Could not connect to the backend.';
                itTicketAlert.classList.add('alert-danger');
                console.error('Ticket Submission Error:', error);
            }
        });
    }

    // --------------------------------------------------
    // 4. HR COMPLAINT SUBMISSION LOGIC
    // --------------------------------------------------
    if (hrComplaintForm) {
        hrComplaintForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hrComplaintAlert.classList.add('d-none');
            hrComplaintAlert.classList.remove('alert-success', 'alert-danger');

            const subject = document.getElementById('hrSubject').value.trim();
            const complaintDetails = document.getElementById('complaintDetails').value.trim();

            const requestBody = { subject, complaintDetails };
            const url = `${API_BASE}/hr/complaint`;

            try {
                const response = await fetch(url, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                
                if (response.ok) {
                    hrComplaintAlert.textContent = `Success! Your complaint has been sent to HR.`;
                    hrComplaintAlert.classList.add('alert-success');
                    hrComplaintForm.reset();
                    
                    // FIX: Robust Modal Closing (HR Complaint) - Safely hides the modal
                    setTimeout(() => {
                        const modalElement = document.getElementById('hrComplaintModal');
                        if (typeof bootstrap !== 'undefined' && bootstrap.Modal && modalElement) {
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            if (modal) modal.hide();
                        }
                        hrComplaintAlert.classList.add('d-none');
                    }, 2000);
                } else {
                    hrComplaintAlert.textContent = data.message || 'HR submission failed.';
                    hrComplaintAlert.classList.add('alert-danger');
                }
                hrComplaintAlert.classList.remove('d-none');

            } catch (error) {
                hrComplaintAlert.textContent = 'Network error. Could not connect to the backend.';
                hrComplaintAlert.classList.add('alert-danger');
                hrComplaintAlert.classList.remove('d-none');
                console.error('HR Submission Error:', error);
            }
        });
    }

}); // <--- FINAL CLOSING BRACKET