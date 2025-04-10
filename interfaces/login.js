async function validateLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password })
        });

        // First check if response is OK
        if (!response.ok) {
            const errorData = await response.json();
            errorMessage.textContent = errorData.error || "Login failed. Please try again.";
            return;
        }

        // If response is OK, process the data
        const data = await response.json();
        
        // Store user ID and redirect based on role
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("Fname", data.Fname);
        localStorage.setItem("Lname", data.Lname);
        if (data.role === "Customer") {
            window.location.href = "booking.html";
        } else if (data.role === "Mechanic") {
            window.location.href = "index_mechanic.html";
        }

    } catch (error) {
        console.error("Full error:", error);
        errorMessage.textContent = "Server error. Please try again later.";
    }
}

document.getElementById('loginForm').addEventListener('submit', validateLogin);