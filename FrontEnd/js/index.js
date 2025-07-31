import { getCategories, getWorks } from "./api.js";

const gallery = document.querySelector(".gallery");
let token = localStorage.getItem("token");
let allProjects = []; // Contient tous les projets récupérés depuis l'API
let allCategories = [{ id: -1, name: "Tous" }]; // Contient toutes les catégories avec une entrée "Tous"

// Affiche un projet dans la galerie
function informations(work) {
  const card = `
    <figure id="A${work?.id}">
      <img src="${work?.imageUrl}" crossOrigin="anonymous">
      <figcaption>${work?.title}</figcaption>
    </figure>
  `;
  gallery.insertAdjacentHTML("beforeend", card);
}

// Affiche tous les projets (après appel API)
async function displayAll() {
  const data = await getWorks();
  allProjects = data;
  displayProjects(allProjects);
}

// Affiche un tableau de projets dans la galerie
function displayProjects(tableauProjects) {
  gallery.innerHTML = ""; // Vide la galerie avant d'insérer les projets
  tableauProjects.forEach((project) => informations(project));
}

// Récupère les catégories et les affiche sous forme de boutons
async function displayCategories() {
  const categories = await getCategories();
  allCategories.push(...categories); // Ajoute toutes les catégories récupérées
  displayFilter();

  // Charge tous les projets une seule fois après avoir les catégories,
  allProjects = await getWorks();
}

// Génère dynamiquement les boutons de filtre
function displayFilter() {
  const btn = document.getElementById("btn");

  allCategories.forEach((category) => {
    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.innerHTML = category.name;
    newButton.className = "btnOpt";
    newButton.setAttribute("id", category.id);

    // Ajoute un gestionnaire de clic sur chaque bouton
    newButton.addEventListener("click", () => {
      filterProject(category.id);
    });

    btn.appendChild(newButton);
  });
}

// Filtre les projets selon la catégorie sélectionnée
function filterProject(idCategory) {
  if (idCategory === -1) {
    displayProjects(allProjects); // Affiche tous les projets sans filtre
  } else {
    const filteredProjects = allProjects.filter(
      (project) => project.categoryId === idCategory
    );
    displayProjects(filteredProjects); // Affiche uniquement les projets correspondant à la catégorie
  }
}

// Gestion affichage du mode édition si utilisateur connecté
if (token) {
  document.getElementById("btnLogin").innerHTML = "logout";
  document.getElementById("modify").style.backgroundColor = "black";

  const modification = `
    <div>
      <i class="fa-regular fa-pen-to-square"></i>
      <p>Mode édition</p>
    </div>
  `;

  const edition = document.createElement("p");
  edition.insertAdjacentHTML("afterbegin", modification);
  edition.className = "edition";

  const container = document.getElementById("container");
  container.appendChild(edition);
} else {
  document.getElementById("btnLogin").innerHTML = "login";
}

// Fonction de déconnexion
function deconnexion() {
  localStorage.removeItem("token");
}

// Ajout de l'événement logout/login
document.getElementById("btnLogin").addEventListener("click", deconnexion);

// Initialisation du projet
displayCategories();
