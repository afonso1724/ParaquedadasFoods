const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
    
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//Fechar apartir do botão de fechar
closeModalBtn.addEventListener("click",function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click",function(event){
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
}})

//Função para adicionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe aumenta apenas a quantidade +1
        existingItem.quantity += 1;

    } else{

        cart.push({
        name,
        price,
        quantity: 1,
    })

    }

    updateCartModal()    
    
}

//Actualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)} Kz</p>
            </div>

            
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            

        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "AOA"
    });

    cartCounter.innerHTML = cart.length;

}

//Função para remover intem do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

       removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
    
        Toastify({
            text: "Lamentamos, estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef44444",
            },
          }).showToast();
        
    return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar pedido para o whatsapp Web
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: ${item.price}Kz |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "934404715"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})


// Verificar a data e hora para manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Janeiro é 0
    const ano = data.getFullYear();

    // Verifica se é a partir de 28/11/2024 e dentro do horário permitido
    if (ano > 2024 || (ano === 2024 && (mes > 11 || (mes === 11 && dia >= 28)))) {
        return hora >= 8 && hora < 19; // Dentro do horário permitido
    }

    return false; // Fora da data ou horário permitido
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}




