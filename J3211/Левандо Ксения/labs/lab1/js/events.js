const events = [

{
    id: 1,
    name: "Concert",
    date: "21 Nov 2026",
    city: "Paris",
    type: "Concert",
    description: "",
    image: ""
},

{
    id: 2,
    name: "Festival",
    date: "5 Dec 2026",
    city: "Berlin",
    type: "Concert",
    description: "",
    image: ""
},

{
    id: 3,
    name: "Theatre",
    date: "14 Dec 2026",
    city: "Milan",
    type: "Theatre",
    description: "",
    image: ""
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
            return (!type || event.type === type) &&
                (!city || event.city.toLowerCase().includes(city)) &&
                (!date || event.date === date);
            });

        filteredEvents.forEach((event) => {
            container.innerHTML += `
            <div class="col-md-4">
            <div class="card h-100 shadow-sm">
            <img src="${event.image}" class="card-img-top">

            <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text text-muted">
            ${event.city} · ${event.date}
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
