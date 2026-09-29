let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let editingIndex = null;

const clients = JSON.parse(localStorage.getItem("clients")) || [];
const services = JSON.parse(localStorage.getItem("services")) || [];

function loadDropdowns() {
  const clientSelect = document.getElementById("schedule-client");
  const serviceSelect = document.getElementById("schedule-service");

  clients.forEach((client) => {
    const option = document.createElement("option");

    option.value = client.name;
    option.textContent = client.name;

    clientSelect.appendChild(option);
  });

  services.forEach((service) => {
    const option = document.createElement("option");

    option.value = service.name;
    option.textContent = service.name;
    option.dataset.duration = service.duration;

    serviceSelect.appendChild(option);
  });
}

const form = document.getElementById("schedule-form");

function hasConflict(newAppointment) {
  const newStart = new Date(newAppointment.date);
  const newEnd = new Date(newAppointment.endDate);

  // Prevent overlapping appointments for the same professional.
  return appointments.some((appointment, index) => {
    if (index === editingIndex) {
      return false;
    }

    if (appointment.professional !== newAppointment.professional) {
      return false;
    }

    const existingStart = new Date(appointment.date);
    const existingEnd = new Date(appointment.endDate);

    return newStart < existingEnd && newEnd > existingStart;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const client = document.getElementById("schedule-client").value;
  const service = document.getElementById("schedule-service").value;
  const professional = document.getElementById("schedule-professional").value;
  const date = document.getElementById("schedule-date").value;
  const endDate = document.getElementById("schedule-end-date").value;
  const duration = document.getElementById("schedule-duration").value;
  const status = document.getElementById("schedule-status").value;

  const newAppointment = {
    client,
    service,
    professional,
    date,
    endDate,
    duration,
    status,
  };

  if (hasConflict(newAppointment)) {
    document.getElementById("schedule-message").style.display = "block";
    return;
  }

  // Update the existing appointment or create a new one.
  if (editingIndex !== null) {
    appointments[editingIndex] = newAppointment;
    editingIndex = null;
  } else {
    appointments.push(newAppointment);
  }

  saveAppointments();
  renderAppointments();

  form.reset();
  document.getElementById("schedule-end-date").value = "";
  document.getElementById("schedule-duration").value = "";
});

function saveAppointments() {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

function getServicePrice(serviceName) {
  const service = services.find((service) => service.name === serviceName);

  return service ? Number(service.price).toFixed(2) : "0.00";
}

function renderAppointments(showAll = false) {
  const tbody = document.querySelector("#schedule-table tbody");
  const professionalFilter = document.getElementById(
    "professional-filter",
  ).value;

  if (!tbody) return;

  tbody.innerHTML = "";

  appointments.sort((a, b) => new Date(b.date) - new Date(a.date));

  const now = new Date();

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesProfessional =
      !professionalFilter || appointment.professional === professionalFilter;

    const matchesClient = !clientName || appointment.client === clientName;

    // Client history shows all appointments; normal view shows upcoming only.
    const matchesDate =
      clientName || showAll || new Date(appointment.date) >= now;

    return matchesProfessional && matchesClient && matchesDate;
  });

  filteredAppointments.forEach((appointment) => {
    const index = appointments.indexOf(appointment);
    const today = new Date().toISOString().split("T")[0];
    const appointmentDay = appointment.date.split("T")[0];

    const start = new Date(appointment.date);

    const formattedDate =
      start.toLocaleDateString() +
      " " +
      start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    const end = appointment.endDate
      ? new Date(appointment.endDate)
      : new Date(appointment.date);

    const formattedEndTime = end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const tr = document.createElement("tr");

    if (appointmentDay === today) {
      tr.classList.add("today");
    }

    tr.innerHTML = `
      <td>${appointment.client}</td>
      <td>${appointment.service}</td>
      <td>${appointment.professional}</td>
      <td>$${getServicePrice(appointment.service)}</td>
      <td>${appointment.status || "Scheduled"}</td>
      <td>${formattedDate} - ${formattedEndTime}</td>
      <td>
        <button onclick="editAppointment(${index})">✏️</button>
        <button onclick="deleteAppointment(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  if (filteredAppointments.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">No appointments found</td>
      </tr>
    `;
  }
}

function calculateEndTime() {
  const serviceSelect = document.getElementById("schedule-service");
  const startInput = document.getElementById("schedule-date");
  const endInput = document.getElementById("schedule-end-date");
  const durationInput = document.getElementById("schedule-duration");

  const selectedService = services.find(
    (service) => service.name === serviceSelect.value,
  );

  if (!selectedService) return;

  if (!durationInput.value) {
    durationInput.value = selectedService.duration;
  }

  const duration = Number(durationInput.value);

  if (!startInput.value || !duration) return;

  // Calculate the appointment end time from the start time and duration.
  const start = new Date(startInput.value);
  start.setMinutes(start.getMinutes() + duration);

  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");
  const time = start.toTimeString().slice(0, 5);

  endInput.value = `${year}-${month}-${day}T${time}`;
}

document
  .getElementById("schedule-service")
  .addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];

    document.getElementById("schedule-duration").value =
      selectedOption.dataset.duration || "";

    calculateEndTime();
  });

document
  .getElementById("schedule-date")
  .addEventListener("change", calculateEndTime);

document
  .getElementById("schedule-duration")
  .addEventListener("input", calculateEndTime);

function deleteAppointment(index) {
  // Store the selected appointment until the user confirms deletion.
  window.appointmentToDelete = index;

  document.getElementById("delete-appointment-message").style.display = "block";
}

function confirmDeleteAppointment() {
  appointments.splice(window.appointmentToDelete, 1);

  saveAppointments();
  renderAppointments();

  closeDeleteAppointmentMessage();
}

function closeDeleteAppointmentMessage() {
  document.getElementById("delete-appointment-message").style.display = "none";

  window.appointmentToDelete = null;
}

function editAppointment(index) {
  const appointment = appointments[index];

  document.getElementById("schedule-client").value = appointment.client;
  document.getElementById("schedule-service").value = appointment.service;
  document.getElementById("schedule-professional").value =
    appointment.professional;
  document.getElementById("schedule-date").value = appointment.date;
  document.getElementById("schedule-duration").value = appointment.duration;
  document.getElementById("schedule-status").value =
    appointment.status || "Scheduled";
  document.getElementById("schedule-end-date").value = appointment.endDate;

  editingIndex = index;
}

const appointmentSearch = document.getElementById("appointment-search");

if (appointmentSearch) {
  appointmentSearch.addEventListener("input", function () {
    const query = appointmentSearch.value.toLowerCase();

    filterAppointments(query);
  });
}

function filterAppointments(query) {
  const tbody = document.querySelector("#schedule-table tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  // Keep the original appointment index so Edit and Delete work after searching.
  const filtered = appointments
    .map((appointment, index) => ({ appointment, index }))
    .filter(({ appointment }) => {
      const dateText = new Date(appointment.date)
        .toLocaleString()
        .toLowerCase();

      return (
        appointment.client.toLowerCase().includes(query) ||
        appointment.service.toLowerCase().includes(query) ||
        appointment.professional.toLowerCase().includes(query) ||
        dateText.includes(query)
      );
    });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">No appointments found</td>
      </tr>
    `;

    return;
  }

  filtered.forEach(({ appointment, index }) => {
    const tr = document.createElement("tr");

    const start = new Date(appointment.date);

    const formattedDate =
      start.toLocaleDateString() +
      " " +
      start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    const end = appointment.endDate
      ? new Date(appointment.endDate)
      : new Date(appointment.date);

    const formattedEndTime = end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    tr.innerHTML = `
      <td>${appointment.client}</td>
      <td>${appointment.service}</td>
      <td>${appointment.professional}</td>
      <td>$${getServicePrice(appointment.service)}</td>
      <td>${appointment.status || "Scheduled"}</td>
      <td>${formattedDate} - ${formattedEndTime}</td>
      <td>
        <button onclick="editAppointment(${index})">✏️</button>
        <button onclick="deleteAppointment(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function loadProfessionals() {
  const professionals = JSON.parse(localStorage.getItem("professionals")) || [];

  const professionalSelect = document.getElementById("schedule-professional");

  professionalSelect.innerHTML = `<option value="">Select Professional</option>`;

  professionals.forEach((professional) => {
    professionalSelect.innerHTML += `
      <option value="${professional.name}">
        ${professional.name}
      </option>
    `;
  });

  const professionalFilter = document.getElementById("professional-filter");

  professionalFilter.innerHTML = `<option value="">All Professionals</option>`;

  professionals.forEach((professional) => {
    professionalFilter.innerHTML += `
      <option value="${professional.name}">
        ${professional.name}
      </option>
    `;
  });
}

const params = new URLSearchParams(window.location.search);
const professionalName = params.get("professional");
const clientName = params.get("client");

loadDropdowns();
loadProfessionals();

if (professionalName) {
  document.getElementById("professional-filter").value = professionalName;
}

if (clientName) {
  document.getElementById("schedule-client").value = clientName;
}

renderAppointments();

document
  .getElementById("professional-filter")
  .addEventListener("change", function () {
    renderAppointments();
  });

const showAllButton = document.getElementById("show-all-appointments");
let showingAll = false;

showAllButton.addEventListener("click", function () {
  showingAll = !showingAll;

  renderAppointments(showingAll);

  showAllButton.textContent = showingAll ? "Show Upcoming" : "Show All";
});

function closeScheduleMessage() {
  document.getElementById("schedule-message").style.display = "none";
}
