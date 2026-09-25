function logout() {
  document.getElementById("logout-message").style.display = "block";
}

function confirmLogout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}

function closeLogoutMessage() {
  document.getElementById("logout-message").style.display = "none";
}
