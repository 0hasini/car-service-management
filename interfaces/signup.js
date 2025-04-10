document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
    // Validate passwords match
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Get selected role
    const roleSelect = document.getElementById('role');
    const selectedRole = roleSelect.value;
    
    if (!selectedRole) {
        alert('Please select whether you are a Customer or Mechanic');
        return;
    }

    // Prepare form data matching backend expectations
    const formData = {
        Fname: document.getElementById('fname').value,
        Lname: document.getElementById('lname').value,
        username: document.getElementById('username').value,
        password: password,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value.replace('+91 ', ''),
        street_no: document.getElementById('street-no').value,
        street_name: document.getElementById('street-name').value,
        building_name: document.getElementById('building').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value,
        role: selectedRole
    };

    try {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        // Success - handle based on role
        if (selectedRole === "Mechanic") {
            // Store user ID for mechanic specialization step
            sessionStorage.setItem('tempUserId', data.userId);
            window.location.href = 'mechanic-specialization.html';
        } else {
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        alert(error.message || 'An error occurred during signup');
    }
});

// Phone number formatting for India
const phoneInput = document.getElementById('phone_number');
phoneInput.addEventListener('input', (e) => {
    if (!e.target.value.startsWith('+91 ')) {
        e.target.value = '+91 ';
    }
});
});