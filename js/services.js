let services = JSON.parse(localStorage.getItem("services")) || [];

const form = document.getElementById("service-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("service-name").value;
  const price = document.getElementById("service-price").value;
  const duration = document.getElementById("service-duration").value;
  const index = document.getElementById("service-index").value;

  // Add a new service or update an existing one.
  if (index === "") {
    services.push({ name, price, duration });
  } else {
    services[index] = { name, price, duration };
  }

  saveServices();
  renderServices();

  form.reset();
  document.getElementById("service-index").value = "";
});

function saveServices() {
  localStorage.setItem("services", JSON.stringify(services));
}

function renderServices() {
  const tbody = document.querySelector("#services-table tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  services.forEach((service, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.price}</td>
      <td>${service.duration} min</td>
      <td>
        <button onclick="editService(${index})">✏️</button>
        <button onclick="deleteService(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

renderServices();

function editService(index) {
  const service = services[index];

  document.getElementById("service-name").value = service.name;
  document.getElementById("service-price").value = service.price;
  document.getElementById("service-duration").value = service.duration;
  document.getElementById("service-index").value = index;
}

function deleteService(index) {
  // Store the selected service until the user confirms deletion.
  window.serviceToDelete = index;

  document.getElementById("delete-service-message").style.display = "block";
}

function confirmDeleteService() {
  // Remove the selected service and save the updated list.
  services.splice(window.serviceToDelete, 1);

  saveServices();
  renderServices();

  closeDeleteServiceMessage();
}

function closeDeleteServiceMessage() {
  document.getElementById("delete-service-message").style.display = "none";
  window.serviceToDelete = null;
}

const serviceSearch = document.getElementById("service-search");

if (serviceSearch) {
  serviceSearch.addEventListener("input", function () {
    const query = serviceSearch.value.toLowerCase();

    filterServices(query);
  });
}

function filterServices(query) {
  const tbody = document.querySelector("#services-table tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = services
    .map((service, index) => ({ service, index }))
    .filter(({ service }) => service.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">No services found</td>
      </tr>
    `;
    return;
  }

  filtered.forEach(({ service, index }) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.price}</td>
      <td>${service.duration} min</td>
      <td>
        <button onclick="editService(${index})">✏️</button>
        <button onclick="deleteService(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}
