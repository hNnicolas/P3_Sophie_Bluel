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
  update.addEventListener("click", async (e) => {
    e.preventDefault();
    allProjects = await getWorks(); // Récupération des projets
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
function displayAllModal(projects) {
  document.querySelector(".galleryModal").innerHTML = "";
  projects.forEach(displayProject);
}

// Navigation entre les vues modale (ajout de photo)
const add = document.getElementById("button-add");
const content = document.getElementById("modal-content");
const content2 = document.getElementById("next-modal-container");
const close2 = document.getElementById("close2");

add.addEventListener("click", () => {
  content.style.display = "none";
  content2.style.display = "block";
});

document.getElementById("back").addEventListener("click", () => {
  content.style.display = "block";
  content2.style.display = "none";
});

close2.addEventListener("click", () => {
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
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    deleteProject(e.target.id);
  }
});

// Téléchargement de l’image dans le formulaire
function telecharger() {
  let telecharger_image = "";
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
  figure.setAttribute("id", work.id);

  const img = document.createElement("img");
  img.src = work.imageUrl;

  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.append(img, caption);
  gallery.appendChild(figure);
}

// Événements liés au téléchargement d’image
document.getElementById("imageUrl").addEventListener("change", telecharger);
document.getElementById("adding").addEventListener("click", () => {
  document.getElementById("imageUrl").click();
});

// Envoi du projet à l’API
const button = document.getElementById("submit");
button.addEventListener("click", async (e) => {
  e.preventDefault();

  const photo = document.getElementById("imageUrl");
  const title = document.getElementById("title");
  const category = document.getElementById("category");

  if (!photo.value || !title.value || !category.value) {
    document.getElementById("Error").textContent =
      "Il faut remplir le formulaire.";
    return;
  }

  document.getElementById("Error").textContent = "";

  const categories = await getCategories();

  for (let i = 0; i < categories.length; i++) {
    if (category.value === categories[i].name) {
      const image = photo.files[0];
      const token = localStorage.getItem("token");

      if (image.size < 4 * 1048576) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title.value);
        formData.append("category", categories[i].id);

        const requete = await addWork(formData);
        if (requete) {
          allProjects.push(requete);
          addWorkToGallery(requete);
          document.querySelector(".galleryModal").innerHTML = "";
          displayAllModal(allProjects);
        }
      } else {
        document.getElementById("Error").textContent =
          "La taille de la photo est supérieure à 4 Mo.";
        photo.value = null;
        document.getElementById("ajout_container").style.display = null;
        document.getElementById("image_telecharger_images").style.display =
          "none";
      }

      supprime();
    }
  }
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
