document.getElementById("specialization-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const selected = document.querySelector('input[name="specialization"]:checked');
    const specialization = selected ? selected.value : null;

    if (specialization) {
        const response = await fetch("http://localhost:3000/signup/mechanic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ specialization })
        });

        const data = await response.json();
        alert(data.msg);

        if (response.ok) {
            window.location.href = "index_mechanic.html";
        }
    } else {
        alert("Please select your specialization.");
    }
});