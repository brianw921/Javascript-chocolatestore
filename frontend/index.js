let productList = document.querySelector('#product-list')
let JSONify = (res) => res.json()
let checkOutBtn = document.querySelector('.checkout-btn')
let cartList = document.querySelector("#cart-list")
let pastOrders = document.querySelector("#prev-id")
let ordersList = document.querySelector("#order-list")

window.cart = []

//READ
fetch("http://localhost:3000/products")
    .then(JSONify)
    .then((productsArray) => {
        console.log(productsArray)
        productsArray.forEach((product) => {
            productList.innerHTML += `
            <div style="display: flex; flex-direction: column" data-id="${product.id}>
                <div data-id=${product.id} style="font-size: 40px;">  ${product.name} </div>
                <div class="gird-flex" style='background-image: url(${product.image}); background-size: cover; background-position: center; height: 300px; width: 300px;'>          
                </div>
                <div class="product-${product.id}">$${product.price}</div>
                <button id="button-${product.id}" data-id=${product.id} class="buy-btn"> Add to Cart </button>
                 

            </div>
            `          
           //STEP 1 buy button should add product to the window.cart
        })
    })
//CREATE if I clicked on a certain product, it will add to my cart


    

productList.addEventListener("click", (evt) => {
    if(evt.target.className === "buy-btn"){
        
        let productID = evt.target.dataset.id
        window.cart.push(productID)
        
       
        fetch(`http://localhost:3000/products/${productID}`)
        .then(JSONify)
        .then((product) => {
            //In cart list add the list of items
            if (cartList.innerText.includes("Congratulations you have checked out!")){
                cartList.innerHTML = ""
            } 
            cartList.innerHTML += `<b data-id=${product.id}> 
                <b> ${product.name} </b>
                ${product.price}`
        })
    }
})

//STEP 2 iterate though the window.cart and show each product on the Items list on the cart in INDEX.html
//do not need anything in the order_products controller.

//STEP 3 search through the cart to remove the cart
//I know I have a cart with Product ID, and I have a cart List/ 
//How do I take that whole cart list and put it in to the back end to localhost:3000/orders

//Once I check out, it will create an Order on the backend
checkOutBtn.addEventListener("click", (evt) => {
    
    fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify({
            products: window.cart
        })
    })
    .then(JSONify)
    .then((orderCheckOut) => {
        
        if (window.cart = []){
        cartList.innerHTML = "Congratulations you have checked out!"
        ordersList.innerHTML += `<li data-id="${orderCheckOut.id}"> ${orderCheckOut.id}</li>`
        }
    })
})

//Shows a list of orders previously made by the user
fetch("http://localhost:3000/orders")
    .then(JSONify)
    .then((ordersArray) => {
        ordersArray.forEach((order) => {
            ordersList.innerHTML += `<li data-id="${order.id}">${order.id}</li>`
        })
    })

    //Shows what products have been ordered if I clicked that particular order
ordersList.addEventListener("click", (evt) => { 
    if (evt.target.tagName === "LI"){
        evt.preventDefault()
        let orderId = evt.target.dataset.id 
        
        fetch(`http://localhost:3000/orders/${orderId}`)
            .then(JSONify)
            .then((orderObj) => {
                
                pastOrders.innerHTML = `<button data-id="${orderId}">REFUND</button>`
                
                orderObj.products.forEach((product) => {
                    pastOrders.innerHTML += `<li data-id="${product.id}"> ${product.name} </li>`
                })   
            })    
    }
})

//DELETE an order and update the dom
pastOrders.addEventListener("click", (evt) => {
    evt.preventDefault()
   if(evt.target.tagName === "BUTTON"){
    let orderId = evt.target.dataset.id 
    
    fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "DELETE",
    })
    .then(JSONify)
    .then((refund) => {
        pastOrders.innerHTML = "Your refund is processing, please wait 3-4 business days"
        let orderLiId = ordersList.querySelector(`[data-id='${orderId}']`)
        orderLiId.remove()
    
        //ordersList.innerHTML -= `<li data-id="${orderId}">${orderId}</li>`   
    })
    }
})



