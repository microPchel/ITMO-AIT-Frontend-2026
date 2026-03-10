const organizers = JSON.parse(localStorage.getItem("organizers")) || [];

// --- register---
document.getElementById("orgRegisterForm").onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById("orgRegName").value.trim();
    const email = document.getElementById("orgRegEmail").value.trim();
    const password = document.getElementById("orgRegPassword").value;

    if (organizers.find(o => o.email === email)) {
        return alert("Organizer with this email already exists");
    }

    organizers.push({ name, email, password });
    localStorage.setItem("organizers", JSON.stringify(organizers));

    alert("Organizer registered successfully! You can login now.");
    // clean form
    document.getElementById("orgRegisterForm").reset();
};

// --- log in ---
document.getElementById("orgLoginForm").onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById("orgLoginEmail").value.trim();
    const password = document.getElementById("orgLoginPassword").value;

    const org = organizers.find(o => o.email === email && o.password === password);
    if (!org) return alert("Wrong email or password");

    // save organizer logged-in
    localStorage.setItem("organizerAuth", "true");
    localStorage.setItem("organizerEmail", email);

    // redirect to organizer dashboard
    window.location.href = "organizer-dashboard.html";
};