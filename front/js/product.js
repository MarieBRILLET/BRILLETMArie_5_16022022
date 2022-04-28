// Récuperer les informations produits de la page d'accueil
// Récuperer l'id de la page produit
const queryString_url_id=window.location.search;
//pour extraire l'id
const urlSearchParams= new URLSearchParams(queryString_url_id);
const id=urlSearchParams.get("id");

//point d'ancrage des données
const selectorimage = document.querySelector('.item__img');
const selectortitle = document.querySelector('#title');
const selectorprice = document.querySelector('#price');
const selectordescription = document.querySelector('#description');
const selectorcolor = document.querySelector('#colors');
const selectorquantity = document.querySelector('#quantity');
const selectorbtn = document.querySelector('#addToCart');
//by default btn is disabled so no add cart is possible
selectorbtn.disabled = true;
function alterstyle(button){
    button.style.cursor = "not-allowed";
}
function resetstyle(button){
    button.style.cursor = "pointer";
}
//value for condition to active btn
let colorValid = false;
let quantityValid = false;

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response)=>{
        if(response.ok){ 
            return response.json();
        }
    })
    .then((produitData)=>{
        selectorimage.innerHTML = `<img src="${produitData.imageUrl}" alt="${produitData.altTxt}"></img>`;
        selectortitle.innerHTML = `${produitData.name}`;
        selectorprice.innerHTML = `${produitData.price}`;
        selectordescription.innerHTML = `${produitData.description}`;
        for(let color of produitData.colors){
            selectorcolor.innerHTML +=
            `<option value="${color}">${color}</option>`;
        }
        alterstyle(selectorbtn);
    })
    .catch((err)=>{
        console.log("error:"+err);
    })
    //definir les valeurs pour condition d'accès au panier
    selectorcolor.addEventListener("change", (event)=>{
        if(event.target.value != ""){
            colorValid = true;
            if(colorValid && quantityValid){
                selectorbtn.disabled = false;
                resetstyle(selectorbtn);
            }
        }
    })
    selectorquantity.addEventListener("change", (event)=>{
        let quantity = parseInt(event.target.value);
        if(quantity >= 1 && quantity <= 100){
            quantityValid = true;
            if(colorValid && quantityValid){
                selectorbtn.disabled = false;
                resetstyle(selectorbtn);
            }
        }
    })
    //ecouter + envoyer au panier
    selectorbtn.addEventListener("click", (event)=>{        
        event.preventDefault();
        let optionsProduct = {
            id_produit: id,
            color_produit: selectorcolor.value,
            quantity_produit: parseInt(selectorquantity.value),
        };
        alert("Votre produit a bien été ajouté au panier");
        //local storage
        let productInLocalStorage = JSON.parse(localStorage.getItem("produit"));
        //fonction pour eviter repetition
        const ajoutProductInLocalStorage = ()=>{
            productInLocalStorage.push(optionsProduct);
            localStorage.setItem("produit", JSON.stringify(productInLocalStorage));
        }
        //si il y a des produits dans local storage
        if(productInLocalStorage){
            //si il y a deja le meme produit dans local storage
            let foundProduct = productInLocalStorage.find(p => p.id_produit === optionsProduct.id_produit && p.color_produit === optionsProduct.color_produit);
            if(foundProduct != undefined){
                foundProduct.quantity_produit += optionsProduct.quantity_produit;
                //if the quantity is greater than 100
                localStorage.setItem("produit", JSON.stringify(productInLocalStorage));
            }
            else{
                ajoutProductInLocalStorage(optionsProduct); 
            }
        }
        //si il n'y a pas de produit dans local storage
        else{
            productInLocalStorage = [];
            ajoutProductInLocalStorage(optionsProduct);
        }
    })