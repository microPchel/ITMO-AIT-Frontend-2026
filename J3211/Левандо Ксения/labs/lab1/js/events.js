const events = [

{
    id: 1,
    name: "Concert",
    date: "2026-11-21",
    city: "Paris",
    type: "Concert",
    venue: "La Defense",
    description: "",
    image: "",
    seatMap: "img/seatmap_concert.png",
    organizer: "cool_company@gmail.com"
},

{
    id: 2,
    name: "Festival",
    date: "2026-12-05",
    city: "Berlin",
    type: "Festival",
    venue: "Uber Arena",
    description: "",
    image: "",
    seatMap: "img/seatmap_festival.png"
},

{
    id: 3,
    name: "Theatre",
    date: "2026-12-14",
    city: "Milan",
    type: "Theatre",
    venue: "La Scala",
    description: "",
    image: "",
    seatMap: "img/seatmap_theatre.png"
}

];


document.getElementById("typeFilter").addEventListener("change", renderEvents);
document.getElementById("cityFilter").addEventListener("input", renderEvents);
document.getElementById("dateFilter").addEventListener("change", renderEvents);

function renderEvents() {
        const type = document.getElementById("typeFilter").value;
        const city = document.getElementById("cityFilter").value.toLowerCase();
        const date = document.getElementById("dateFilter").value;

        const container = document.getElementById("eventsContainer");

        container.innerHTML = "";

        const filteredEvents = events.filter(event => {
            const typeMatch = (type === "All" || !type) || event.type === type;
            const cityMatch = !city || event.city.toLowerCase().includes(city);
            const dateMatch = !date || event.date === date;
            return typeMatch && cityMatch && dateMatch;
            });

        if (filteredEvents.length === 0) {
        container.innerHTML = `<p class="fw-bold">No matching events found</p>`;
        return;
    }

        filteredEvents.forEach((event) => {
            container.innerHTML += `
            <div class="col-md-4">
            <div class="card h-100 shadow-sm">
            <img src="${event.image}" class="card-img-top">

            <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text text-muted">
            ${event.city} · ${new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>

            <button class="btn btn-outline-primary me-2"
            onclick="openEvent(${event.id})">
            View
            </button>

            <button class="btn btn-warning"
            onclick="buyTicket('${event.name}','${event.date}')">
            Buy ticket
            </button>

            </div>
            </div>

            </div>
            `;
        });
}


function buyTicket(eventName, eventDate) {
    if (localStorage.getItem("auth") !== "true") {
    alert("Please login to buy tickets");
    window.location.href = "login.html";
    return;
}
    const user = JSON.parse(localStorage.getItem("user"));
    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    tickets.push({
    event: eventName,
    date: eventDate,
    owner: user.email
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));

    alert("Ticket purchased!");

}

function openEvent(id) {
    const event = events.find(e => e.id === id);
    localStorage.setItem("selectedEvent", JSON.stringify(event));
    window.location.href = "event.html";
}

renderEvents();
