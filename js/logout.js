function logout() {
  document.getElementById("logout-message").style.display = "block";
}

function confirmLogout() {
  // Remove the login session before returning to the login page.
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}

function closeLogoutMessage() {
  document.getElementById("logout-message").style.display = "none";
}
