import { getCategories, getWorks } from "./api.js";

const gallery = document.querySelector(".gallery");
let token = localStorage.getItem("token");
let allProjects = []; //tableau de tous les projets
let allCategories = [
  {
    id: -1,
    name: "Tous",
  },
]; //tableau de catégories avec un élément "Tous" pour afficher tous les projets
//fonction display All avec catch

function informations(work) {
  // fonction pour afficher les informations sur chaque projet
  const card = `
    <figure id ="A${work?.id}">
      <img src="${work?.imageUrl}" crossOrigin="anonymous">
      <figcaption>${work?.title}</figcaption>
    </figure>
  `;
  document.querySelector(".gallery").insertAdjacentHTML("beforeend", card);
}

async function displayAll() {
  // fonction pour afficher tous les projets dans le DOM
  const data = await getWorks()
  allProjects = data;
  displayProjects(allProjects); // appel de la fonction displayProjects pour afficher tous les projets
}

function displayProjects(tableauProjects) {
  // fonction pour afficher tous les projets dans le DOM
  document.querySelector(".gallery").innerHTML = ""; // Effacement de l'élément HTML avec la classe .gallery

  for (let i = 0; i <= tableauProjects.length - 1; i++) {
    // Boucle pour afficher tous les projets
    informations(tableauProjects[i]); // Appel de la fonction informations pour afficher les informations sur chaque projet
  }
}

async function displayCategories(){

  const categories = await getCategories()
  categories.forEach((element) => {
    //ajouter les categories dans le tableau allCategories
    allCategories.push(element); //ajouter les categories dans le tableau allCategories
  });            
  displayFilter(); // appel de la fonction displayFilter pour afficher les boutons de filtre dans le DOM    
}

function displayFilter() {
  // fonction pour afficher les boutons de filtre dans le DOM
  const btn = document.getElementById("btn"); // récupération de l'élément HTML avec l'id btn
  allCategories.forEach((element) => {
    // Création d'un bouton pour chaque catégorie
    const newButton = document.createElement("button"); // Création d'un bouton
    newButton.type = "button"; // Ajout d'un type "button" pour chaque bouton
    newButton.innerHTML = element.name; // Ajout d'un nom pour chaque bouton (nom de la catégorie)
    newButton.className = "btnOpt"; // Ajout d'une classe pour chaque bouton
    newButton.setAttribute("id", element.id); // Ajout d'un id pour chaque bouton (id de la catégorie)
    //set attribute pour ajouter un attribut a un element html
    newButton.addEventListener('click' , () => {
      // Ajout d'un événement au clic sur chaque bouton
      filterProject(element.id); // Appel de la fonction filterProject pour afficher les projets de la catégorie sélectionnée
      //element.id est l'id de la categorie selectionnée
    })    
    btn.appendChild(newButton); // Ajout du bouton dans l'élément HTML avec l'id btn
  });
}

function filterProject(idCategory) {
  if (idCategory == -1)
    displayProjects(allProjects); //afficher tous les projets
  //si idCategory egal a -1 afficher tous les projets
  //sinon afficher les projets de la categorie selectionnée
  else {
    const newTable = allProjects.filter(
      (element) => element.categoryId == idCategory
    );
    //filtrer les projets de la categorie selectionnée
    //element.categoryId est l'id de la categorie du projet
    displayProjects(newTable); //afficher les projets de la categorie selectionnée
  }
}


// changer login par logout si l'utilisateur est connecté
if (localStorage.getItem("token")) {
  document.getElementById("btnLogin").innerHTML = "logout";
  document.getElementById("modify").style.backgroundColor = "black";

  const modification = `
     <div>
        <i class="fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>  
    </div>
  `;
  //edition
  const edition = document.createElement("p"); //création d'un paragraphe
  edition.type = "button"; //ajout d'un type bouton
  edition.insertAdjacentHTML("afterbegin", modification); //ajout du bouton modifier dans la page
  edition.className = "edition"; //ajout de la classe edition
  const container = document.getElementById("container");
  container.appendChild(edition);

  const changment = document.createElement("button");
  changment.type = "button";
} else {
  document.getElementById("btnLogin").innerHTML = "login";
}

// fonction deconnexion
function deconnexion() {
  localStorage.removeItem("token");
}
document.getElementById("btnLogin").addEventListener("click", deconnexion);


displayCategories()
displayAll(); // appel de la fonction displayAll pour afficher tous les projets dans le DOM

