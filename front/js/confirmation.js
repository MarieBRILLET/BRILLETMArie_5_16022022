//Récuperation de l'id de la commande
const queryString_url_id=window.location.search;
//pour extraire l'id
const urlSearchParams= new URLSearchParams(queryString_url_id);
const order_Id=urlSearchParams.get("id");
const selectorIdOrder = document.querySelector('#orderId');
selectorIdOrder.innerHTML = order_Id;
//effacer le local storage
localStorage.clear();