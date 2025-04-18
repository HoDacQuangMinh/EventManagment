let events = [];
let comments = [];
let notifications = [];

function createEvent() {
  const title = document.getElementById("title").value.trim();
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value.trim();

  if (!title || !date || !description) {
    alert("Please fill all fields.");
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    date,
    description
  };

  events.push(newEvent);
  addNotification(`Event "${title}" created for ${new Date(date).toLocaleString()}`);
  renderEvents();

  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
}

function renderEvents() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  events.forEach(event => {
    const div = document.createElement("div");
    div.className = "event";
    div.innerHTML = `
      <strong>${event.title}</strong><br>
      <small>${new Date(event.date).toLocaleString()}</small>
      <p>${event.description}</p>
      <div class="rsvp-buttons">
        <button onclick="rsvp('${event.id}', 'Accepted')">Accept</button>
        <button onclick="rsvp('${event.id}', 'Declined')">Decline</button>
      </div>
    `;
    eventList.appendChild(div);
  });
}

function rsvp(eventId, response) {
  const event = events.find(e => e.id == eventId);
  if (event) {
    addNotification(`You have ${response} the invitation to "${event.title}".`);
  }
}

function postComment() {
  const input = document.getElementById("discussionInput");
  const comment = input.value.trim();

  if (comment) {
    comments.push(comment);
    input.value = "";
    renderComments();
  }
}

function renderComments() {
  const board = document.getElementById("discussionBoard");
  board.innerHTML = "";
  comments.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = msg;
    board.appendChild(div);
  });
}

function addNotification(message) {
  notifications.push(message);
  if (notifications.length > 5) notifications.shift();
  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById("notifications");
  container.innerHTML = "";
  notifications.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = msg;
    container.appendChild(div);
  });
}

// Auto-reminders every 30s for upcoming events
setInterval(() => {
  const now = new Date();
  events.forEach(event => {
    const diff = new Date(event.date) - now;
    if (diff > 0 && diff < 60000) {
      addNotification(`Reminder: "${event.title}" starts soon!`);
    }
  });
}, 30000);
