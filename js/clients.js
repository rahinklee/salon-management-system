let clients = JSON.parse(localStorage.getItem("clients")) || [];
const form = document.getElementById("client-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

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
  tbody.innerHTML = ""; //clear screen

  clients.forEach((client, index) => {
    const tr = document.createElement("tr");

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

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
  const confirmDelete = confirm("Are you sure you want to delete this client?");

  if (!confirmDelete) return;

  const clients = JSON.parse(localStorage.getItem("clients")) || [];

  clients.splice(index, 1);

  saveClients();

  renderClients();
}

renderClients();

// Campo de busca
const clientSearch = document.getElementById("client-search");

if (clientSearch) {
  clientSearch.addEventListener("input", function () {
    const query = clientSearch.value.toLowerCase();

    // chama função que atualiza a tabela filtrando
    filterClients(query);
  });
}

function filterClients(query) {
  const clients = JSON.parse(localStorage.getItem("clients")) || [];
  const tbody = document.querySelector("#clients-table tbody");

  tbody.innerHTML = ""; // limpa tabela

  // filtra pelo nome, email ou telefone
  const filtered = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query),
  );

  filtered.forEach((client) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>
        <button onclick="editClient(${index})">Edit></button>
        <button onclick="deleteClient(${index})">Delete></button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // if find nothing
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No clients found</td></tr>`;
  }
}

function viewClientAppointments(clientName) {
  window.location.href = `schedule.html?client=${encodeURIComponent(clientName)}`;
}
