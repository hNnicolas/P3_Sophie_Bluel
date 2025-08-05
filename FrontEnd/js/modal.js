import { addWork, deleteWork, getCategories, getWorks } from "./api.js";

let allProjects = [];

// Récupération des éléments du DOM
const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");
const deleteBtn = document.getElementById("deleteBtn");

// Affiche le bouton "modifier" si un token est présent (utilisateur connecté)
if (localStorage.getItem("token")) {
  update.style.display = "block";
} else {
  update.style.display = "none";
}

// Fermeture de la modale via la croix
close.addEventListener("click", function () {
  modal.style.display = "none";
});

// Fermeture de la modale si clic en dehors
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Fonction d’affichage de la modale et des projets
function showModal() {
  const update = document.getElementById("updates");
  update.addEventListener("click", async (e) => {
    e.preventDefault();
    let allProjects = await getWorks(); // Récupération des projets
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    displayAllModal(allProjects); // Affichage des projets dans la modale
  });
}

// Affiche un projet individuel dans la modale
function displayProject(work) {
  const card = `
    <figure id="M${work.id}">
      <img src="${work.imageUrl}" crossOrigin="anonymous">
      <i id="${work.id}" class="fa-regular fa-trash-can"></i>
    </figure>`;
  document.getElementById("products").insertAdjacentHTML("beforeend", card);
}

// Affiche tous les projets dans la galerie modale
function displayAllModal(allProjects) {
  document.querySelector(".galleryModal").innerHTML = "";
  for (let j = 0; j <= allProjects.length - 1; j++) {
    displayProject(allProjects[j]);
  }
}

// Navigation entre les vues modale (ajout de photo)
const add = document.getElementById("button-add");
const content = document.getElementById("modal-content");
const content2 = document.getElementById("next-modal-container");
const close2 = document.getElementById("close2");

add.addEventListener("click", function () {
  content.style.display = "none";
  content2.style.display = "block";
});

const back = document.getElementById("back");
back.addEventListener("click", function () {
  content.style.display = "block";
  content2.style.display = "none";
});

close2.addEventListener("click", function () {
  modal.style.display = "none";
});

// Supprime un projet par son id
async function deleteProject(id) {
  const result = await deleteWork(id);
  if (result) {
    allProjects = allProjects.filter((el) => el.id !== id);
    document.getElementById("M" + id)?.remove();
    document.getElementById("A" + id)?.remove();
  }
}

// Écoute les clics sur les icônes poubelles
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-trash-can")) {
    deleteProject(e.target.id);
  }
});

const form = document.getElementById("form");
const title = document.getElementById("title");
const category = document.getElementById("category");
const imageUrl = document.getElementById("imageUrl");
const button = document.getElementById("submit");

// Téléchargement de l’image dans le formulaire
function telecharger() {
  var telecharger_image = "";
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    telecharger_image = reader.result;
    const photo = document.getElementById("image_telecharger");
    document.getElementById("image_telecharger_images").style.display = "block";
    photo.style.backgroundImage = `url(${telecharger_image})`;
    document.getElementById("ajout_container").style.display = "none";
  });

  reader.readAsDataURL(this.files[0]);
}

// Ajoute le projet dans la galerie principale
function addWorkToGallery(work) {
  const gallery = document.getElementById("gallery");
  const figure = document.createElement("figure");
  figure.setAttribute("id", "A" + work.id);

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.append(img, caption);
  gallery.appendChild(figure);
}

// Téléchargement image en cliquant sur "ajouter une photo"
document.getElementById("adding").addEventListener("click", () => {
  document.getElementById("imageUrl").click();
});

// Événement de changement de fichier (optionnel si tu veux prévisualiser)
document.getElementById("imageUrl").addEventListener("change", telecharger);

// Soumission du formulaire d'ajout
document.getElementById("submit").addEventListener("click", async (e) => {
  e.preventDefault();

  const photo = document.getElementById("imageUrl");
  const title = document.getElementById("title");
  const category = document.getElementById("category");
  const error = document.getElementById("Error");

  // Vérification du formulaire
  if (!photo.files[0] || !title.value || !category.value) {
    error.textContent = "Il faut remplir le formulaire.";
    return;
  }

  const image = photo.files[0];

  if (image.size > 4 * 1024 * 1024) {
    error.textContent = "La taille de la photo est supérieure à 4 Mo.";
    photo.value = null;
    document.getElementById("ajout_container").style.display = null;
    document.getElementById("image_telecharger_images").style.display = "none";
    return;
  }

  error.textContent = "";

  // Récupérer les catégories pour trouver l'id correspondant
  const categories = await getCategories();
  const selectedCategory = categories.find(
    (cat) => cat.name === category.value
  );

  if (!selectedCategory) {
    error.textContent = "Catégorie invalide.";
    return;
  }

  // Préparation des données
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title.value);
  formData.append("category", selectedCategory.id);

  // Envoi à l’API
  const response = await addWork(formData);
  if (response) {
    // Recharger les projets depuis l'API
    allProjects = await getWorks();

    // Réactualiser la galerie principale
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    allProjects.forEach(addWorkToGallery);

    // Réactualiser la galerie modale
    document.querySelector(".galleryModal").innerHTML = "";
    displayAllModal(allProjects);

    // Réinitialiser l’interface
    document.getElementById("content").style.display = "block";
    document.getElementById("content2").style.display = "none";
    document.getElementById("modal").style.display = "block";

    // Réinitialiser le formulaire
    title.value = "";
    category.selectedIndex = 0;
    photo.value = null;
    document.getElementById("image_telecharger_images").style.display = "none";
    document.getElementById("ajout_container").style.display = null;
  } else {
    error.textContent = "Erreur lors de l’ajout du projet.";
  }

  supprime();
});

// Réinitialise le formulaire
function supprime() {
  document.getElementById("ajout_container").style.display = null;
  document.getElementById("image_telecharger_images").style.display = "none";
  document.getElementById("title").value = null;
  document.getElementById("imageUrl").value = null;
  document.getElementById("category").value = null;
}

// Ajout de l'interface "modifier" si connecté
if (localStorage.getItem("token")) {
  const modifierDiv = `<div id="modifier"></div>`;
  const updates = `
    <a href="#modal"></a>
    <i class="fa-regular fa-pen-to-square"></i>
    <p>modifier</p>
  `;
  document.getElementById("updates").insertAdjacentHTML("afterbegin", updates);
  document
    .getElementById("intro")
    .insertAdjacentHTML("afterbegin", modifierDiv);
}

// Lancement de l'affichage de la modale
showModal();
