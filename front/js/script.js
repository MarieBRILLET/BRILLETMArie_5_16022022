// Récuperer les produits de l'API
//point d'ancrage des données
const affichage = document.querySelector('#items');
// Utilisation de fetch
fetch("http://localhost:3000/api/products")
    .then((response)=>{
        if(response.ok){ 
            return response.json();
        }
    })
    .then((canapeData)=>{
        // La boucle avec les valeurs des produits pour l'affichage en html
        for(let canape of canapeData){
            if(canape._id===undefined && canape.imageUrl===undefined && canape.altTxt===undefined && canape.name===undefined && canape.description===undefined){
                throw "erreur au niveau des données";
            }
            affichage.innerHTML += 
            `<a href="./product.html?id=${canape._id}">
                <article>
                    <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                    <h3 class="productName">${canape.name}</h3>
                    <p class="productDescription">${canape.description}</p>
                </article>
            </a>`;
        }      
    })
    .catch((err)=>{
        console.log("error:"+err);
    })