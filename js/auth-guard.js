const user = localStorage.getItem("loggedUser");

if (!user) {
  window.location.href = "index.html";
}
