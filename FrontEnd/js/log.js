const form = document.getElementById("Form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", (event) => {
  //event listener sur le formulaire de connexion
  event.preventDefault(); // Prevent default form submission

  const email = emailInput.value;
  const password = passwordInput.value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          // Store user login information in LocalStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          // Redirect to home page
          window.location.href = "./index.html";
        });
      }
      if (response.status == 401) {
        errorDiv.textContent = "Action non authorisée";
      }
      if (response.status == 404) {
        errorDiv.textContent =
          "Utilisateur non trouvé! Veuillez verifier vos identifiants! ";
      }
    })
    .catch((error) => {
      console.error(error);
      errorDiv.textContent =
        "Une erreur est survenue sur le site veuillez contacter l'administrateur !";
    });
});
