const currentEvent = JSON.parse(localStorage.getItem("selectedEvent"));

document.getElementById("eventTitle").textContent = currentEvent.name;
document.getElementById("eventImage").src = currentEvent.image;
document.getElementById("eventDescription").textContent = currentEvent.description;
document.getElementById("eventVenue").textContent = `Venue: ${currentEvent.venue}`;
document.getElementById("seatMap").src = currentEvent.seatmap;
document.getElementById("eventMeta").textContent =
`${currentEvent.city} · ${new Date(currentEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

document.getElementById("buyBtn").onclick = () => {
    buyTicket(currentEvent.name, currentEvent.date);
};

const reviewsContainer = document.getElementById("reviewsContainer");
let reviews = JSON.parse(localStorage.getItem(`reviews_${currentEvent.id}`)) || [];

function renderReviews() {
    reviewsContainer.innerHTML = "";
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `<p class="text-muted">No reviews yet.</p>`;
        return;
    }
    reviews.forEach(r => {
        const div = document.createElement("div");
        div.className = "card mb-2 p-2";
        div.innerHTML = `<strong>${r.user}</strong>: ${r.text}`;
        reviewsContainer.appendChild(div);
    });
}
renderReviews();

document.getElementById("submitReview").onclick = () => {
    if (localStorage.getItem("organizerAuth") === "true") {
        return alert("Organizers cannot leave reviews.");
    }
    const text = document.getElementById("reviewInput").value.trim();
    if (!text) return alert("Enter review text");
    const user = JSON.parse(localStorage.getItem("user")) || { email: "Guest" };
    reviews.push({ user: user.email, text });
    localStorage.setItem(`reviews_${currentEvent.id}`, JSON.stringify(reviews));
    document.getElementById("reviewInput").value = "";
    renderReviews();
};

// --- Buy ticket logic with categories ---
const buyBtn = document.getElementById("buyBtn");
const ticketCategory = document.getElementById("ticketCategory");
const ticketPrice = document.getElementById("ticketPrice");
const confirmBuyBtn = document.getElementById("confirmBuyBtn");

buyBtn.onclick = () => {
    if (localStorage.getItem("organizerAuth") === "true") {
        return alert("Organizers cannot buy tickets.");
    }

    if (!currentEvent.categories || currentEvent.categories.length === 0) {
        return alert("No ticket categories available");
    }

    // fill select options
    ticketCategory.innerHTML = "";
    currentEvent.categories.forEach((cat, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${cat.name} - $${cat.price}`;
        ticketCategory.appendChild(option);
    });

    // show price
    ticketPrice.textContent = `Price: $${currentEvent.categories[0].price}`;

    // update price on selection
    ticketCategory.onchange = () => {
        const selected = currentEvent.categories[ticketCategory.value];
        ticketPrice.textContent = `Price: $${selected.price}`;
    };

    // show modal
    const modal = new bootstrap.Modal(document.getElementById("buyTicketModal"));
    modal.show();
};

confirmBuyBtn.onclick = () => {
    if (localStorage.getItem("auth") !== "true") {
        alert("Please login to buy tickets");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    const selectedCategory = currentEvent.categories[ticketCategory.value];

    tickets.push({
        eventId: currentEvent.id,
        event: currentEvent.name,
        date: currentEvent.date,
        owner: user.email,
        category: selectedCategory.name,
        price: selectedCategory.price
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));

    alert(`Ticket purchased! Category: ${selectedCategory.name}, $${selectedCategory.price}`);
    bootstrap.Modal.getInstance(document.getElementById("buyTicketModal")).hide();
};