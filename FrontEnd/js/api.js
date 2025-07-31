export const getWorks = () => {
  return fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });
};

export const getCategories = () => {
  return fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });
};

export const deleteWork = (id) => {
  return fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((result) => result.status === 204)
    .catch((err) => {
      console.error(err);
    });
};

export const addWork = (data) => {
  return fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      accept: "application/json",
    },
    body: data,
  })
    .then((requete) => requete.json())
    .catch((e) => console.error(e));
};
