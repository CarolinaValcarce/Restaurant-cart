
const cartDOM = document.querySelector(".cart");
const cartItems= document.querySelector(".cart-items");
const navInfo=document.querySelector(".nav-info");
const storeItemIcon=document.querySelector(".store-item-icon");
const productsDOM= document.querySelector(".section-center");
const cartOverlay=document.querySelector(".cart-overlay");
const cartContent=document.querySelector(".cart-content");
const closeCart=document.querySelector(".close-cart");
const clearCartBtn=document.querySelector(".clear-cart");
const cartTotal=document.querySelector(".cart-total");
const filterBtns = document.querySelectorAll('.filter-btn');

//crear carrito como arreglo
let cart=[];
let buttonsDOM=[];

//tomar los productos
class Products{
	async getProducts(){
		try{
			let result= await fetch("http://localhost:8080/Restaurant cart/products.json");
			let data= await result.json();
		 	let products=data.items;
			products=products.map(item =>{
				const{id,title,src,price,description,category}=item;
				return{id,title,src,price,description,category};
			});
			return products;

		} catch(error){
			console.log(error);
		}
	}
}
//mostrar los productos
class UI{
	displayProducts(products){
		let result="";
		products.forEach(product =>{
			result+=`<article class="menu-item">
						<img src=${product.src} class="photo" alt="foto Producto"/>
						<div class="item-info">
							<header>
								<h4> ${product.title}</h4>
								<h4 class="price"> ${product.price}€ </h4>
							</header>
							<p class="item-description"> ${product.description}</p>
							<button class="store-item-icon" data-id=${product.id}>
		           	 		<i class="fa fa-shopping-cart"></i> Añadir al carrito
	              			</button>
						</div>	
					</article>`;
		});

		productsDOM.innerHTML=result;
	}

	getStoreItemIcons(){
		const buttons= [...document.querySelectorAll(".store-item-icon")];
		buttonsDOM=buttons;
		console.log(buttons);
		buttons.forEach(button=>{
			let id= button.dataset.id;
			console.log(id);
			let inCart= cart.find(item => item.id.toString()===id);
			console.log(inCart);
			if (inCart){
				button.innerText="Ya en el carrito";
				button.disabled=true;
			} 
			button.addEventListener("click", (event)=>{
				event.target.innerText="Ya en el carrito";
				event.target.disabled=true;

					//tomar cada producto de productos
				let cartItem={...Storage.getProduct(id), amount:1};
					//añadir productos al carrito
				
				cart=[...cart, cartItem];
					//guardar el carrito en el local Storage
				Storage.saveCart(cart);
					//establecer los valores del carrito
				this.setCartValues(cart);
					//mostrar cada producto del carrito
				this.addCartItem(cartItem);
					//mostrar el carrito
				this.showCart();
			});
			
		});
	}

	// displayFilterButtons(products){
	// 	// Este es el método que nos filtra los productos. Pero una vez cargado el DOM, no nos permite rellenar el carrito con los productos mostrados en el filtro.
	  
	//    	filterBtns.forEach(function(btn){
	//    		btn.addEventListener("click", function(e){

	//    			console.log(e.currentTarget.dataset.id);
	//    			const category= e.currentTarget.dataset.id;
	//    			let products=JSON.parse(localStorage.getItem("products"));
	//    			const menucategory= products.filter(function(item){
	//    				console.log(item.category);
	//    				if (item.category===category){
	//    					return item;
	//    				}
	//    			});
	//    			if (category==="all"){
	//    				console.log(products);
	//    				// this.displayProducts (menu);
	//    				//o incluímos la línea anterior que llama al método de la misma clase pero da error, o reescribimos método con el nuevo parámetro.
	//    				let result="";
	// 				products.forEach(item=>{
	// 				result+=`<article class="menu-item">
	// 					<img src=${item.src} class="photo" alt="foto Producto"/>
	// 					<div class="item-info">
	// 						<header>
	// 							<h4> ${item.title}</h4>
	// 							<h4 class="price"> ${item.price}€ </h4>
	// 						</header>
	// 						<p class="item-description"> ${item.description}</p>
	// 						<button class="store-item-icon" data-id=${item.id}>
	// 	           	 		<i class="fa fa-shopping-cart"></i> Añadir al carrito
	//               			</button>
	// 					</div>	
	// 				</article>`;
	// 				});

	// 				productsDOM.innerHTML=result;
					
	//    			} else{
	//    				console.log(menucategory);
	//    				// this.displayProducts(menucategory);
	//    				//o incluímos la línea anterior que llama al método de la misma clase pero da error, o reescribimos método con el nuevo parámetro.
	//    				let result="";
	// 				menucategory.forEach(item=>{
	// 				result+=`<article class="menu-item">
	// 					<img src=${item.src} class="photo" alt="foto Producto"/>
	// 					<div class="item-info">
	// 						<header>
	// 							<h4> ${item.title}</h4>
	// 							<h4 class="price"> ${item.price}€ </h4>
	// 						</header>
	// 						<p class="item-description"> ${item.description}</p>
	// 						<button class="store-item-icon" data-id=${item.id}>
	// 	           	 		<i class="fa fa-shopping-cart"></i> Añadir al carrito
	//               			</button>
	// 					</div>	
	// 				</article>`;
	// 				});
	// 				productsDOM.innerHTML=result;
	//    			}
	//    		});

 //   		});
	// }

	setCartValues(cart){
		let tempTotal=0;
		let itemsTotal=0;
		cart.map(item =>{
		tempTotal+= item.price*item.amount;
		itemsTotal+= item.amount;
	 		console.log(item.price);
	 	});
	 	cartTotal.innerText= parseFloat(tempTotal.toFixed(2));
	 	cartItems.innerText= itemsTotal;
	 	// console.log(cartTotal,cartItems);
		
	}
	addCartItem(item){
		const div=document.createElement("div");
		div.classList.add("cart-item");
		div.innerHTML=`<img src=${item.src} alt="producto" />
					            <div>
					              <h4>${item.title}</h4>
					              <h5>${item.price}€</h5>
					              <span class="remove-item" data-id=${item.id}>Quitar</span>
					            </div>
					            <div>
					              <i class="fa fa-chevron-up" data-id=${item.id}></i>
					              <p class="item-amount">${item.amount}</p>
					              <i class="fa fa-chevron-down" data-id=${item.id}></i>
					            </div>`;
		cartContent.appendChild(div);
	}
	showCart(){
		cartOverlay.classList.add("transparentBcg");
		cartDOM.classList.add("showCart");
	}
	setupAPP(){
		cart= Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		navInfo.addEventListener("click", this.showCart);
		closeCart.addEventListener('click', this.hideCart);
	}
	populateCart(cart){
		cart.forEach(item => this.addCartItem(item));
	}
	hideCart(){
		cartOverlay.classList.remove("transparentBcg");
		cartDOM.classList.remove("showCart");
	}
	cartLogic(){
		//operativa de "vaciar carrito"
		clearCartBtn.addEventListener("click", ()=>{
			this.clearCart();
		});
		//operativa de "quitar" elemento, y añadir o quitar unidades al elemento.
		cartContent.addEventListener("click", event => {
	     	if (event.target.classList.contains("remove-item")) {
		        let removeItem = event.target;
		        let id = removeItem.dataset.id;
		        cart = cart.filter(item => item.id.toString() !== id);
		        console.log(cart);

		        this.setCartValues(cart);
		        Storage.saveCart(cart);
		        cartContent.removeChild(removeItem.parentElement.parentElement);
		        const buttons = [...document.querySelectorAll(".store-item-icon")];
		        buttons.forEach(button => {
		          	if ((button.dataset.id) === id) {
		           		button.disabled = false;
		            	button.innerHTML = `<i class="fa fa-shopping-cart"></i> Añadir al carrito`;
		          	}
	       		});
	      	} else if (event.target.classList.contains("fa-chevron-up")) {
		        let addAmount = event.target;
		        let id = addAmount.dataset.id;
		        let tempItem = cart.find(item => item.id.toString() === id);
		        tempItem.amount = tempItem.amount + 1;
		        Storage.saveCart(cart);
		        this.setCartValues(cart);
		        addAmount.nextElementSibling.innerText = tempItem.amount;
	      	} else if (event.target.classList.contains("fa-chevron-down")) {
		        let lowerAmount = event.target;
		        let id = lowerAmount.dataset.id;
		        let tempItem = cart.find(item => item.id.toString()=== id);
		        tempItem.amount = tempItem.amount - 1;
		        if (tempItem.amount > 0) {
			        Storage.saveCart(cart);
			        this.setCartValues(cart);
			        lowerAmount.previousElementSibling.innerText = tempItem.amount;
		        } else {
			        cart = cart.filter(item => item.id.toString() !== id);
			          // console.log(cart);

			        this.setCartValues(cart);
			        Storage.saveCart(cart);
			        cartContent.removeChild(lowerAmount.parentElement.parentElement);
			        const buttons = [...document.querySelectorAll(".store-item-icon")];
			        buttons.forEach(button => {
			            if ((button.dataset.id) === id) {
			              	button.disabled = false;
			              	button.innerHTML = `<i class="fa fa-shopping-cart"></i> Añadir al carrito`;
			            }
			        });
		        }
      		}
    	});
	}
	clearCart(){

		cart = [];
	    this.setCartValues(cart);
	    Storage.saveCart(cart);
	    const buttons = [...document.querySelectorAll(".store-item-icon")];
	    buttons.forEach(button => {
	      button.disabled = false;
	      button.innerHTML = `<i class="fas fa-shopping-cart"></i> Añadir al carrito`;
	    });
	    while (cartContent.children.length > 0) {
	      cartContent.removeChild(cartContent.children[0]);
	    }
	    this.hideCart();

	}
	
}
//crear el local storage y almacenar los datos
class Storage{
	static saveProducts(products){
		localStorage.setItem("products", JSON.stringify(products));
	}
	static getProduct(id){

		let products=JSON.parse(localStorage.getItem("products"));
		return products.find(product => product.id.toString()===id);
	}
	static saveCart(cart){
		localStorage.setItem("cart", JSON.stringify(cart));
	}
	static getCart(){
		return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):[];
	}
}

document.addEventListener ("DOMContentLoaded", ()=>{

	const ui= new UI();
	const products= new Products();

	//configuracion aplicacion
	ui.setupAPP();

	//devuelve todos los productos
	products.getProducts().then(products => {
		ui.displayProducts(products);
		Storage.saveProducts(products);
		// ui.displayFilterButtons(products);
	})
	.then(() =>{

		ui.getStoreItemIcons();
		ui.cartLogic();
	});
 
});



