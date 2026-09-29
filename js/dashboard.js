function loadDashboardStats() {
  const clients = JSON.parse(localStorage.getItem("clients")) || [];
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  document.getElementById("total-clients").innerText = clients.length;
  document.getElementById("total-services").innerText = services.length;
  document.getElementById("total-appointments").innerText = appointments.length;

  // Revenue is calculated only from completed appointments.
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed",
  );

  const totalRevenue = completedAppointments.reduce((total, appointment) => {
    const service = services.find(
      (service) => service.name === appointment.service,
    );

    return total + (service ? Number(service.price) : 0);
  }, 0);

  document.getElementById("total-revenue").innerText =
    `$${totalRevenue.toFixed(2)}`;
}

function loadTodayAppointments() {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const table = document.querySelector("#today-appointments tbody");

  if (!table) return;

  table.innerHTML = "";

  // Compare appointment dates with today's date.
  const today = new Date().toDateString();

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.date);

    if (appointmentDate.toDateString() === today) {
      const tr = document.createElement("tr");

      const time = appointmentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      tr.innerHTML = `
        <td>${appointment.client}</td>
        <td>${appointment.service}</td>
        <td>${time}</td>
      `;

      table.appendChild(tr);
    }
  });
}

function loadUpcomingAppointments() {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const tbody = document.querySelector("#upcoming-appointments tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  const now = new Date();

  // Keep only future appointments, sort them by date, and show the next five.
  const upcoming = appointments
    .map((appointment) => ({
      client: appointment.client,
      service: appointment.service,
      dateObj: new Date(appointment.date),
    }))
    .filter((appointment) => appointment.dateObj > now)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 5);

  if (upcoming.length === 0) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td colspan="4">No upcoming appointments</td>
    `;

    tbody.appendChild(tr);
    return;
  }

  upcoming.forEach((appointment) => {
    const tr = document.createElement("tr");

    const date = appointment.dateObj.toLocaleDateString();
    const time = appointment.dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    tr.innerHTML = `
      <td>${date}</td>
      <td>${time}</td>
      <td>${appointment.client}</td>
      <td>${appointment.service}</td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardStats();
  loadTodayAppointments();
  loadUpcomingAppointments();
});
