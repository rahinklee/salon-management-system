const form = document.getElementById("professional-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("professional-name").value;
  const role = document.getElementById("professional-role").value;
  const index = document.getElementById("professional-index").value;

  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  if (index === "") {
    // novo
    professionals.push({ name, role });
  } else {
    // edição
    professionals[index] = { name, role };
  }

  localStorage.setItem("professionals", JSON.stringify(professionals));

  form.reset();
  document.getElementById("professional-index").value = "";

  loadProfessionals();
});

function loadProfessionals() {
  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];
  const tbody = document.querySelector("#professionals-table tbody");

  tbody.innerHTML = "";

  professionals.forEach((professional, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${professional.name}</td>
      <td>${professional.role}</td>
      <td>
        <button onclick="editProfessional(${index})">✏️</button>
        <button onclick="deleteProfessional(${index})">🗑️</button>
        <button onclick="viewProfessionalSchedule(${index})">📅</button>

        
      </td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadProfessionals();
});

function deleteProfessional(index) {
  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  professionals.splice(index, 1);

  localStorage.setItem("professionals", JSON.stringify(professionals));

  loadProfessionals();
}

function editProfessional(index) {
  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  const professional = professionals[index];

  document.getElementById("professional-name").value = professional.name;
  document.getElementById("professional-role").value = professional.role;

  document.getElementById("professional-index").value = index;
}

function viewProfessionalSchedule(index) {
  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  const professional = professionals[index];

  window.location.href = `schedule.html?professional=${encodeURIComponent(professional.name)}`;
}
