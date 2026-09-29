const form = document.getElementById("professional-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("professional-name").value;
  const role = document.getElementById("professional-role").value;
  const index = document.getElementById("professional-index").value;

  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  // Add a new professional or update an existing one.
  if (index === "") {
    professionals.push({ name, role });
  } else {
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

  if (!tbody) return;

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
  // Store the selected professional until the user confirms deletion.
  window.professionalToDelete = index;

  document.getElementById("delete-professional-message").style.display =
    "block";
}

function confirmDeleteProfessional() {
  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  // Remove the selected professional and save the updated list.
  professionals.splice(window.professionalToDelete, 1);

  localStorage.setItem("professionals", JSON.stringify(professionals));

  loadProfessionals();
  closeDeleteProfessionalMessage();
}

function closeDeleteProfessionalMessage() {
  document.getElementById("delete-professional-message").style.display = "none";

  window.professionalToDelete = null;
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

  // Open the schedule filtered by the selected professional.
  window.location.href = `schedule.html?professional=${encodeURIComponent(professional.name)}`;
}
