//récupération des produits dans le local storage pour la page panier
let productInLocalStorage = JSON.parse(localStorage.getItem("produit"));

//affichage des produits du panier
const affichage_panier= document.querySelector("#cart__items");
const total_quantity = document.querySelector("#totalQuantity");
const total_price = document.querySelector("#totalPrice");

let total_quantityCalcul = [];
let total_priceCalcul = [];
let products = [];

//si le panier est vide : afficher le panier est vide
if(productInLocalStorage === null || productInLocalStorage.length === 0){
    const panier_vide = `
    <div class="cart__item">
        <p>Votre panier est vide</p>
    </div>`;
    affichage_panier.innerHTML = panier_vide;
} else{
    //si le panier n'est pas vide : afficher les produits du panier
    for(let i = 0; i < productInLocalStorage.length; i++){  
        fetch(`http://localhost:3000/api/products/${productInLocalStorage[i].id_produit}`)
            .then((response)=>{
                if(response.ok){ 
                    return response.json();
                }
            })
            .then((productInAPI)=>{
                let final_price = parseFloat(productInAPI.price * productInLocalStorage[i].quantity_produit);
                affichage_panier.innerHTML += `
                <article class="cart__item" data-id=${productInLocalStorage[i].id_produit} data-color=${productInLocalStorage[i].color_produit}>
                    <div class="cart__item__img">
                        <img src="${productInAPI.imageUrl}" alt="${productInAPI.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${productInAPI.name}</h2>
                            <p>${productInLocalStorage[i].color_produit}</p>
                            <p>${final_price}€</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté :</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity_produit}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;
                //envoi de l'id pour valider Fetch post
                products.push(productInLocalStorage[i].id_produit);
                //total du panier
                //additionner les prix et les quantités en fonction du nombre de produits dans le panier
                 const reducer = (accumulator, currentValue) => accumulator + currentValue;
                //quantité total
                let quantityProduitPanier = parseInt(productInLocalStorage[i].quantity_produit);//pour que le total soit un nombre
                total_quantityCalcul.push(quantityProduitPanier);
                let quantity_total = total_quantityCalcul.reduce(reducer,0);
                total_quantity.innerHTML = quantity_total;
                //prix total
                total_priceCalcul.push(final_price);
                let price_total = total_priceCalcul.reduce(reducer,0);
                total_price.innerHTML = price_total;
                // ajouter ou enlever la quantité d'un produit
                const modif_quantity = document.querySelectorAll(".itemQuantity");
                for(let i = 0; i < modif_quantity.length; i++){
                    modif_quantity[i].addEventListener("change", (event)=>{
                        if(modif_quantity[i].value >= 1 && modif_quantity[i].value <= 100){
                            let id = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
                            let color = event.target.parentElement.parentElement.parentElement.parentElement.dataset.color;
                            let quantity = event.target.value;
                            let productInLocalStorage = JSON.parse(localStorage.getItem("produit"));
                            let foundProduct = productInLocalStorage.find(p => p.id_produit === id && p.color_produit === color);
                            foundProduct.quantity_produit = quantity;
                            localStorage.setItem("produit", JSON.stringify(productInLocalStorage));
                            location.reload();
                        }else{
                            return alert("Veuillez entrer une quantité comprise entre 1 et 100");
                        } 
                    });
                };
                //supprimer un produit du panier
                const deleteItem = document.querySelectorAll(".deleteItem");
                for(let i = 0; i < deleteItem.length; i++){
                    deleteItem[i].addEventListener("click", (event)=>{
                        let id = event.target.closest(".cart__item").getAttribute("data-id");
                        let color = event.target.closest(".cart__item").getAttribute("data-color");
                        let productInLocalStorage = JSON.parse(localStorage.getItem("produit"));
                        let foundProduct = productInLocalStorage.find(p => p.id_produit === id && p.color_produit === color);
                        let index = productInLocalStorage.indexOf(foundProduct);
                        productInLocalStorage.splice(index, 1);
                        localStorage.setItem("produit", JSON.stringify(productInLocalStorage));
                        location.reload();
                    })
                };
            })
            .catch((err)=>{
                console.log("error:"+err);
            })
    }     
}
//formulaire de commande
const form = document.querySelector(".cart__order__form");
const btn_commande = document.querySelector("#order");
//by default btn is disabled so we can enable it when all the inputs are valid
btn_commande.disabled = true;
function alterstyle(button){
    button.style.cursor = "not-allowed";
}
function resetstyle(button){
    button.style.cursor = "pointer";
}
alterstyle(btn_commande);
//value for condition to active btn
let firstNamValid = false;
let lastNameValid = false;
let addressValid = false;
let cityValid = false;
let emailValid = false;
//1er temps chaque input doit avoir son callback et son message d'erreur
form.firstName.addEventListener("change", (event)=>{
    validNameF(event);
    if(event.target.value != ""){
        firstNamValid = true;
        if(firstNamValid && lastNameValid && addressValid && cityValid && emailValid){
            btn_commande.disabled = false;
            resetstyle(btn_commande);
        }
    }
})
form.lastName.addEventListener("change", (event)=>{
    validNameL(event);
    if(event.target.value != ""){
        lastNameValid = true;
        if(firstNamValid && lastNameValid && addressValid && cityValid && emailValid){
            btn_commande.disabled = false;
            resetstyle(btn_commande);
        }
    }
})
form.address.addEventListener("change", (event)=>{
    validAddress(event);
    if(event.target.value != ""){
        addressValid = true;
        if(firstNamValid && lastNameValid && addressValid && cityValid && emailValid){
            btn_commande.disabled = false;
            resetstyle(btn_commande);
        }
    }
})
form.city.addEventListener("change", (event)=>{
    validCity(event);
    if(event.target.value != ""){
        cityValid = true;
        if(firstNamValid && lastNameValid && addressValid && cityValid && emailValid){
            btn_commande.disabled = false;
            resetstyle(btn_commande);
        }
    }
})
form.email.addEventListener("change", (event)=>{
   validEmail(event);
   if(event.target.value != ""){
        emailValid = true;
        if(firstNamValid && lastNameValid && addressValid && cityValid && emailValid){
            btn_commande.disabled = false;
            resetstyle(btn_commande);
        }
    }
})
//fonction de validation des inputs
let validNameF = () => {
    let nameFRegExp = new RegExp(/^[a-zA-Z]+?([-]{0,1})$/, 'g');
    let p_firstname = form.firstName.nextElementSibling;
    if(nameFRegExp.test(form.firstName.value)){
        p_firstname.innerHTML = "Prénom valide";
        p_firstname.style.color = "#A1FA4F";  
    }else{
        p_firstname.innerHTML = "Prénom invalide, présence de chiffres  et/ou de caractères spéciaux";
        p_firstname.style.color = "#EB3324";
    }
}
let validNameL = () => {
    let nameLRegExp = new RegExp(/^[a-zA-Z]+?([-]{0,1})$/, 'g');
    let p_lastname = form.lastName.nextElementSibling;
    if(nameLRegExp.test(form.lastName.value)){
        p_lastname.innerHTML = "Nom valide";
        p_lastname.style.color = "#A1FA4F";   
    }else{
        p_lastname.innerHTML = "Nom invalide";
        p_lastname.style.color = "#EB3324";
    }
}
let validAddress = () => {
    let addressRegExp = new RegExp(/^[a-zA-Z0-9\s,.'-]{3,}$/, 'g');
    let p_address = form.address.nextElementSibling;
    if(addressRegExp.test(form.address.value)){
        p_address.innerHTML = "Adresse valide";
        p_address.style.color = "#A1FA4F";  
    }else{
        p_address.innerHTML = "Adresse invalide";
        p_address.style.color = "#EB3324";
    }
}
let validCity = () => {
    let cityRegExp = new RegExp(/^[a-zA-Z']+$/, 'g');
    let p_city = form.city.nextElementSibling;
    if(cityRegExp.test(form.city.value)){
        p_city.innerHTML = "Ville valide";
        p_city.style.color = "#A1FA4F";  
    }else{
        p_city.innerHTML = "Ville invalide, présence de chiffres";
        p_city.style.color = "#EB3324";
    }
}
let validEmail = () =>{
    let emailRegExp = new RegExp(
        /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/,'g'
    );
    let p_email = form.email.nextElementSibling;
    if(emailRegExp.test(form.email.value)){
        p_email.innerHTML = "Email valide";
        p_email.style.color = "#A1FA4F";
    }
    else{
        p_email.innerHTML = "Email invalide";
        p_email.style.color = "#EB3324";
    }
}
//2e temps récupérer les données du formulaire
btn_commande.addEventListener("click", (event)=>{
    event.preventDefault();
    let contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value,  
    };
    localStorage.setItem("form", JSON.stringify(contact));
    //Mettre les valeurs du formulaire et les produits sélectionnés dans un objet à envoyer au serveur
    const request_commande = {
        contact,
        products,
    }
    //Envoyer les données au serveur
fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body : JSON.stringify(request_commande),
        headers: {"Content-Type": "application/json"}
    })
    .then((response)=>{
        if(response.ok){ 
            return response.json();
        }
    })
    .then((data) => {
        alert("Votre commande a bien été prise en compte");
        window.location = `./confirmation.html?id=${data.orderId}`;
    })
    .catch((err)=>{
        console.log("error:"+err);
    })
})