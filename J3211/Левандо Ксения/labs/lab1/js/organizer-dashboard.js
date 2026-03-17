document.getElementById("eventDate").min =
    new Date().toISOString().split("T")[0];

// check auth
if (localStorage.getItem("organizerAuth") !== "true") {
    alert("Please login as organizer first");
    window.location.href = "organizer-login.html";
}

// get email of current organizator
const organizerEmail = localStorage.getItem("organizerEmail");

const createForm = document.getElementById("createEventForm");
const myEventsContainer = document.getElementById("myEventsContainer");
const logoutBtn = document.getElementById("logoutBtn");

let events = [];

//load events from api

async function loadEvents() {
    const response = await fetch("http://localhost:3000/events");
    events = await response.json();
    renderMyEvents();
}

loadEvents();

// render events
function renderMyEvents() {
    myEventsContainer.innerHTML = "";

    const myEvents = events.filter(ev => ev.organizer === organizerEmail);

    if (myEvents.length === 0) {
        myEventsContainer.innerHTML = `<p class="text-muted">No events yet.</p>`;
        return;
    }
    
    myEvents.forEach(ev => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="${ev.image}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${ev.name}</h5>
                <p class="text-muted">${ev.city} · ${new Date(ev.date).toLocaleDateString()}</p>
                <p>Venue: ${ev.venue}</p>
                <p>Type: ${ev.type}</p>
                <button class="btn btn-primary btn-sm me-2" onclick="viewSales(${ev.id})">View Sales</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${ev.id})">Delete</button>
            </div>
        </div>
        `;
        myEventsContainer.appendChild(col);
    });
}

// adding categories to event tickets
const categoriesContainer = document.getElementById("categoriesContainer");
const addCategoryBtn = document.getElementById("addCategoryBtn");

addCategoryBtn.onclick = () => {
    const row = document.createElement("div");
    row.className = "row g-2 mb-2 category-row";
    row.innerHTML = `
        <div class="col-md-5">
            <input type="text" class="form-control category-name" placeholder="Category name">
        </div>
        <div class="col-md-5">
            <input type="number" class="form-control category-price" placeholder="Price">
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger remove-category w-100">X</button>
        </div>
    `;
    row.querySelector(".remove-category").onclick = () => row.remove();
    categoriesContainer.appendChild(row);

};

// first category by default
addCategoryBtn.click();

// create new
createForm.onsubmit = async function(e) {

    e.preventDefault();

    const name = document.getElementById("eventName").value.trim();
    const date = document.getElementById("eventDate").value;
    const city = document.getElementById("eventCity").value.trim();
    const venue = document.getElementById("eventVenue").value.trim();
    const type = document.getElementById("eventType").value;
    const image = document.getElementById("eventImage").value.trim();
    const description = document.getElementById("eventDescription").value.trim();
    const seatmap = document.getElementById("eventSeatmap").value.trim();

    const cityPattern = /^[A-Za-z\s-]+$/;

    if (!name || !date || !city || !venue || !type) {
        alert("Please fill all required fields");
        return;
    }

    if (!cityPattern.test(city)) {
        alert("City name must contain only letters");
        return;
    }

    const exists = events.find(ev =>
    ev.name === name &&
    ev.date === date &&
    ev.organizer === organizerEmail
    );

    if (exists) {
            alert("You already created this event");
            return;}

    // collect ticket categories

    const categoryRows = document.querySelectorAll(".category-row");

    const categories = [];

    categoryRows.forEach(row => {

        const name = row.querySelector(".category-name").value.trim();
        const price = row.querySelector(".category-price").value;

        if (name && price) {

            categories.push({
                name,
                price: Number(price)
            });

        }

    });

    if (categories.length === 0) {
        alert("Add at least one ticket category");
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        name,
        date,
        city,
        venue,
        type,
        image,
        description,
        seatmap,
        categories,
        organizer: organizerEmail
    };

    await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEvent)
    });

    createForm.reset();

    loadEvents();
};


async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE"
    });
    loadEvents();
}


async function viewSales(eventId) {
    const response = await fetch(`http://localhost:3000/tickets?eventId=${String(eventId)}`);
    const soldTickets = await response.json();

    if (soldTickets.length === 0) {
        alert("No tickets sold yet for this event");
        return;
    }
    const list = soldTickets
        .map(t => `${t.owner} - ${t.category}`)
        .join("\n");

    alert(`Sold tickets:\n${list}`);
}

// Logout
logoutBtn.onclick = () => {
    localStorage.removeItem("organizerAuth");
    localStorage.removeItem("organizerEmail");
    window.location.href = "organizer-login.html";
};