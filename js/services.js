let services = JSON.parse(localStorage.getItem("services")) || [];

const form = document.getElementById("service-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("service-name").value;
  const price = document.getElementById("service-price").value;
  const duration = document.getElementById("service-duration").value;
  const index = document.getElementById("service-index").value;

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
  const confirmDelete = confirm(
    "Are you sure you want to delete this service?",
  );

  if (!confirmDelete) return;

  services.splice(index, 1);

  saveServices();
  renderServices();
}

// Campo de busca de services
const serviceSearch = document.getElementById("service-search");

if (serviceSearch) {
  serviceSearch.addEventListener("input", function () {
    const query = serviceSearch.value.toLowerCase();

    // chama função que atualiza a tabela filtrando
    filterServices(query);
  });
}

function filterServices(query) {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const tbody = document.querySelector("#services-table tbody");

  tbody.innerHTML = ""; // limpa tabela

  const filtered = services.filter((service) =>
    service.name.toLowerCase().includes(query),
  );

  filtered.forEach((service) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.price}</td>
      <td>${service.duration} min</td>
      <td>
        <button onclick="editService(${index})">Edit></button>
        <button onclick="deleteService(${index})">Delete></button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No services found</td></tr>`;
  }
}
