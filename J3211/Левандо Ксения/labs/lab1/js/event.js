let currentEvent = null;

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

// get event from API
async function loadEvent() {
    try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        currentEvent = await response.json();

        renderEvent();
        loadReviews();

    } catch (error) {
        console.error("Error loading event:", error);
    }
}

loadEvent();

function renderEvent() {
    document.getElementById("eventTitle").textContent = currentEvent.name;
    document.getElementById("eventImage").src = currentEvent.image;
    document.getElementById("eventDescription").textContent = currentEvent.description;
    document.getElementById("eventVenue").textContent = `Venue: ${currentEvent.venue}`;
    document.getElementById("seatMap").src = currentEvent.seatmap;
    document.getElementById("eventMeta").textContent =
    `${currentEvent.city} · ${new Date(currentEvent.date).toLocaleDateString('en-GB', 
        { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

// REVIEWS
const reviewsContainer = document.getElementById("reviewsContainer");
let reviews = [];

async function loadReviews() {
    const response = await fetch(`http://localhost:3000/reviews?eventId=${eventId}`);
    reviews = await response.json();
    renderReviews();
}

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

document.getElementById("submitReview").onclick = async () => {
    if (localStorage.getItem("organizerAuth") === "true") {
        return alert("Organizers cannot leave reviews.");
    }
    const text = document.getElementById("reviewInput").value.trim();
    if (!text) return alert("Enter review text");
    const user = JSON.parse(localStorage.getItem("user")) || { email: "Guest" };//?

    await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            eventId: Number(eventId),
            user: user.email,
            text: text
        })
    });

    document.getElementById("reviewInput").value = "";
    loadReviews();
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

confirmBuyBtn.onclick = async () => {
    if (localStorage.getItem("auth") !== "true") {
        alert("Please login to buy tickets");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const selectedCategory = currentEvent.categories[ticketCategory.value];

    await fetch("http://localhost:3000/tickets", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            eventId: Number(currentEvent.id),
            event: currentEvent.name,
            date: currentEvent.date,
            owner: user.email,
            category: selectedCategory.name,
            price: selectedCategory.price

        })

    });

    alert(`Ticket purchased! Category: ${selectedCategory.name}, $${selectedCategory.price}`);
    bootstrap.Modal.getInstance(document.getElementById("buyTicketModal")).hide();
};