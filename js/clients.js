let clients = JSON.parse(localStorage.getItem("clients")) || [];
const form = document.getElementById("client-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const index = document.getElementById("client-index").value;

  if (index === "") {
    clients.push({ name, email, phone });
  } else {
    clients[index] = { name, email, phone };
  }

  saveClients();
  renderClients();
  form.reset();

  document.getElementById("client-index").value = "";
});

function saveClients() {
  localStorage.setItem("clients", JSON.stringify(clients));
}

function renderClients() {
  const tbody = document.querySelector("#clients-table tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  clients.forEach((client, index) => {
    const tr = document.createElement("tr");

    const appointmentCount = appointments.filter(
      (appointment) => appointment.client === client.name,
    ).length;

    tr.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>
        <button onclick="viewClientAppointments('${client.name}')">
          ${appointmentCount}
        </button>
      </td>
      <td>
        <button onclick="editClient(${index})">✏️</button>
        <button onclick="deleteClient(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function editClient(index) {
  const client = clients[index];

  document.getElementById("name").value = client.name;
  document.getElementById("email").value = client.email;
  document.getElementById("phone").value = client.phone;
  document.getElementById("client-index").value = index;
}

function deleteClient(index) {
  window.clientToDelete = index;
  document.getElementById("delete-client-message").style.display = "block";
}

function confirmDeleteClient() {
  clients.splice(window.clientToDelete, 1);

  saveClients();
  renderClients();

  closeDeleteClientMessage();
}

function closeDeleteClientMessage() {
  document.getElementById("delete-client-message").style.display = "none";
  window.clientToDelete = null;
}

renderClients();

const clientSearch = document.getElementById("client-search");

if (clientSearch) {
  clientSearch.addEventListener("input", function () {
    const query = clientSearch.value.toLowerCase();

    filterClients(query);
  });
}

function filterClients(query) {
  const tbody = document.querySelector("#clients-table tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = clients
    .map((client, index) => ({ client, index }))
    .filter(
      ({ client }) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query),
    );

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No clients found</td>
      </tr>
    `;
    return;
  }

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  filtered.forEach(({ client, index }) => {
    const tr = document.createElement("tr");

    const appointmentCount = appointments.filter(
      (appointment) => appointment.client === client.name,
    ).length;

    tr.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>
        <button onclick="viewClientAppointments('${client.name}')">
          ${appointmentCount}
        </button>
      </td>
      <td>
        <button onclick="editClient(${index})">✏️</button>
        <button onclick="deleteClient(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function viewClientAppointments(clientName) {
  window.location.href = `schedule.html?client=${encodeURIComponent(clientName)}`;
}
