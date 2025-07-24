import { addWork, deleteWork, getCategories, getWorks } from "./api.js";

// si on est connecté on affiche une div
let allProjects = [];
const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");
const deleteBtn = document.getElementById("deleteBtn");
//quand on est connecté on affiche le bouton modifier
if (localStorage.getItem("token")) {
  update.style.display = "block";
} else {
  update.style.display = "none";
}

// lorsqu'on click sur le bouton close on ferme la modal
close.addEventListener("click", function () {
  modal.style.display = "none";
});

// Quand l'utilisateur clique en dehors du modal, ferme le modal
window.onclick = function (event) {
  if (event.target == modal) {
    // si l'evenement est le modal on ferme le modal
    modal.style.display = "none";
  }
};

function showModal() {
  const update = document.getElementById("updates");
  update.addEventListener("click", async (e) => {
    e.preventDefault();
    let allProjects = await getWorks();
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    displayAllModal(allProjects);
  });
}

// affichage de produits avec fetch (work) dans la modal
function displayProject(works) {
  // fonction pour afficher les informations sur chaque projet dans le DOM
  const cards = `
      <figure id ="M${works?.id}">
      <img src="${works?.imageUrl} "crossOrigin="anonymous">
       
        <i id ="${works.id}" class="fa-regular fa-trash-can "></i>
       
        </div>
            
      </figure>
       `;
  document.getElementById("products").insertAdjacentHTML("beforeend", cards); //insertion de la variable cards dans le html avant la fin de la balise
}

function displayAllModal(allProjects) {
  document.querySelector(".galleryModal").innerHTML = ""; // Effacement de l'élément HTML avec la classe .galleryModall
  // Boucle pour afficher tous les projets
  for (let j = 0; j <= allProjects.length - 1; j++) {
    displayProject(allProjects[j]); // Appel de la fonction displayProject pour afficher les informations sur chaque projet
  }
}

//quand on clique sur ajouter une photo on passe au content suivant modal
const add = document.getElementById("button-add");
const content = document.getElementById("modal-content");
const content2 = document.getElementById("next-modal-container");
const close2 = document.getElementById("close2");

add.addEventListener("click", function () {
  content.style.display = "none";
  content2.style.display = "block";
});

//quand on clique sur retour on passe au content précédent modal
const back = document.getElementById("back");
back.addEventListener("click", function () {
  content.style.display = "block";
  content2.style.display = "none";
});

//quand on clique sur fermer on ferme la modal
close2.addEventListener("click", function () {
  modal.style.display = "none";
});

// Fonction pour supprimer un projet
async function deleteProject(id) {
  const result = await deleteWork(id);
  if (result) {
    allProjects = allProjects.filter((element) => element.id != id); //filter les projets qui ont un id différent de celui qu'on veut supprimer
    const modalProject = document.getElementById("M" + id);
    if (modalProject) {
      modalProject.remove(); //supprime le projet dans la modal
    }
    const indexProject = document.getElementById("A" + id);
    if (indexProject) {
      indexProject.remove(); //supprime le projet dans la page index
    }
  }
}

// Suppression d'un projet
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-trash-can")) {
    //si on clique sur l'icone trash on supprime le projet
    deleteProject(e.target.id); //supprime le projet dans la modal et dans la page index
    // le e.target.id permet de récupérer l'id du projet sur lequel on a cliqué
  }
});

//suppression de tous les projets
deleteBtn.addEventListener("click", function () {
  for (let i = 0; i < allProjects.length; i++) {
    deleteProject(allProjects[i].id); // supprime tous les projets dans la modal et dans la page index
    // le allProjects[i].id permet de récupérer l'id de chaque projet
  }
});

const form = document.getElementById("form");
const title = document.getElementById("title");
const category = document.getElementById("category");
const imageUrl = document.getElementById("imageUrl");
const button = document.getElementById("submit");

function telecharger() {
  var telecharger_image = "";
  const reader = new FileReader(); //permet de lire le contenu d'un fichier sous forme de flux de données

  reader.addEventListener("load", () => {
    //permet de lire le contenu d'un fichier sous forme de flux de données
    telecharger_image = reader.result;
    const photo = document.getElementById("image_telecharger");
    document.getElementById("image_telecharger_images").style.display = "block";

    photo.style.backgroundImage = `url(${telecharger_image})`;
    document.getElementById("ajout_container").style.display = "none";
  });

  reader.readAsDataURL(this.files[0]);
  //readAsDataURL permet de lire le contenu d'un fichier sous forme de flux de données
}

function addWorkToGallery(work) {
  const gallery = document.getElementById("gallery");
  const newWorkFigure = document.createElement("figure");
  newWorkFigure.setAttribute("id", work.id);
  const newWorkImg = document.createElement("img");
  newWorkImg.setAttribute("src", work.imageUrl);
  const newWorkFigCaption = document.createElement("figcaption");
  newWorkFigCaption.innerText = work.title;

  newWorkFigure.appendChild(newWorkImg);
  newWorkFigure.appendChild(newWorkFigCaption);
  gallery.appendChild(newWorkFigure);
}

document.getElementById("imageUrl").addEventListener("change", telecharger);
document.getElementById("adding").addEventListener("click", function () {
  document.getElementById("imageUrl").click();
});

///////////////////Envoi des fichiers a API///////////////////

button.addEventListener("click", async (e) => {
  e.preventDefault(); //annule le comportement par défaut du bouton submit

  // Récupération des éléments du formulaire
  const photo = document.getElementById("imageUrl");
  const category = document.getElementById("category");
  const title = document.getElementById("title");

  // Vérification que le formulaire est rempli
  if (photo.value === "" || title.value === "" || category.value === "") {
    document.getElementById("Error").innerHTML =
      "Il faut remplir le formulaire.";
  } else {
    document.getElementById("Error").innerHTML = "";

    const categorydata = await getCategories();
    // Parcours de la liste des catégories pour récupérer l'id correspondant à la catégorie sélectionnée
    for (let i = 0; i <= categorydata.length - 1; i++) {
      //length-1 car on commence à 0 et pas à 1
      if (category.value === categorydata[i].name) {
        //si la valeur de la catégorie est égale à la valeur de la catégorie dans la liste
        categorydata[i].name = categorydata[i].id; //on récupère l'id de la catégorie correspondante

        // Récupération de l'image et du token de l'utilisateur
        const image = document.getElementById("imageUrl").files[0]; //recupere l'image
        let token = localStorage.getItem("token");
        const title = document.getElementById("title").value;

        // Vérification de la taille de l'image
        if (image.size < 4 * 1048576) {
          // 1048576 = 1Mo
          // Création du formulaire pour l'envoi des données
          const formData = new FormData(); //creation d'un objet de type formdata
          //FormData permet de créer un ensemble de paires clé/valeur représentant les champs d'un formulaire et leurs valeurs.
          formData.append("image", image); //ajout de l'image dans le formdata
          formData.append("title", title); //ajout du titre dans le formdata
          formData.append("category", categorydata[i].id); //ajout de la categorie dans le formdata

          // Envoi des données à l'API via une requête POST
          //async permet de définir une fonction asynchrone
          //await permet d'attendre la résolution d'une promesse
          const setNewProject = async (data) => {
            //fonction asynchrone pour envoyer les données a l'API
            //fonction asynchnrone permet d'attendre la résolution d'une promesse
            //essaye d'envoyer les données
            const requete = await addWork(data);
            if (requete) {
              addWorkToGallery(requete);
              //document.getElementById("gallery").innerHTML = ""; //on vide la div gallery
              document.querySelector(".galleryModal").innerHTML = ""; //on vide la div galleryModal
              displayAllModal(allProjects);
            }
          };
          setNewProject(formData); //appel de la fonction pour envoyer les données
          // parametre formData pour envoyer les données du formulaire
        } else {
          // Affichage d'un message d'erreur si la taille de l'image est trop grande
          document.getElementById("Error").innerHTML =
            "La taille de la photo est supérieure à 4 Mo.";

          photo.value = null;
          document.getElementById("ajout_container").style.display = null; //affiche le formulaire d'ajout
          document.getElementById("image_telecharger_images").style.display =
            "none";
        }
        supprime(); //supprime les données du formulaire d'ajout quand on ferme la boite de dialogue
      }
    }
  }
});

function supprime() {
  //fonction pour supprimer les données du formulaire d'ajout
  // Suppression de l'affichage des données quand on ferme la boîte de dialogue d'ajout
  document.getElementById("ajout_container").style.display = null;
  document.getElementById("image_telecharger_images").style.display = "none";

  // Suppression des données de titre
  const input_titre_ajout = document.getElementById("title");
  input_titre_ajout.value = null;

  // Suppression de l'URL de la photo
  const input_photo_url = document.getElementById("imageUrl");
  input_photo_url.value = null;

  // Suppression des données de catégorie
  const category = document.getElementById("category");
  category.value = null;
}

//creation d'une div lorsqu'on est connecté
if (localStorage.getItem("token")) {
  const modifier = `
  
  <div id= "modifier">
 

  </div>`;
  // Création d'un modèle de boîte de dialogue pour la modification
  const updates = `
  
        <a href ="#modal"></a>
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p> 
   `;
  // Ajout du bouton "modifier" dans la page
  document.getElementById("updates").insertAdjacentHTML("afterbegin", updates);

  document.getElementById("intro").insertAdjacentHTML("afterbegin", modifier);
}

showModal();
