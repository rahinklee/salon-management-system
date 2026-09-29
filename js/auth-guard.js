const user = localStorage.getItem("loggedUser");

// Redirect users to the login page if they are not authenticated.
if (!user) {
  window.location.href = "index.html";
}
