function exportBackup() {
  document.getElementById("backup-message").style.display = "block";
}

function confirmBackup() {
  const backup = {
    clients: JSON.parse(localStorage.getItem("clients")) || [],
    services: JSON.parse(localStorage.getItem("services")) || [],
    professionals: JSON.parse(localStorage.getItem("professionals")) || [],
    appointments: JSON.parse(localStorage.getItem("appointments")) || [],
  };

  const data = JSON.stringify(backup, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "barber-shop-backup.json";
  link.click();

  document.getElementById("backup-message").style.display = "none";
}

function closeBackupMessage() {
  document.getElementById("backup-message").style.display = "none";
}
