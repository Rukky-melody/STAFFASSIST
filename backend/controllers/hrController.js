// backend/controllers/hrController.js (HR Complaints Placeholder)

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS
    }
});

exports.submitHRComplaint = async (req, res) => {
    const employeeId = req.user.employeeId; 
    const { subject, complaintDetails } = req.body;

    if (!subject || !complaintDetails) {
        return res.status(400).json({ message: 'Subject and complaint details are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_SERVICE_USER, 
        to: process.env.HR_EMAIL, 
        subject: `HR Complaint from Employee ${employeeId}: ${subject}`,
        html: `<p>Employee ID: **${employeeId}**</p>
               <p>Complaint Details:</p>
               <pre>${complaintDetails}</pre>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'HR Complaint submitted and emailed successfully!' });
    } catch (error) {
        console.error('Nodemailer Error:', error);
        res.status(500).json({ message: 'Failed to send HR complaint email. Check your local environment setup.' });
    }
};