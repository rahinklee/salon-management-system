const form = document.getElementById("loginForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Check the login credentials before allowing access to the system.
  if (username === "admin" && password === "123") {
    localStorage.setItem("loggedUser", username);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("login-message").style.display = "block";
  }
});

function closeLoginMessage() {
  document.getElementById("login-message").style.display = "none";
}
