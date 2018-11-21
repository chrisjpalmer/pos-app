import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

const sampleProducts:Product[] = [
    {
        productId: 1,
        name: "Tottenham Hotspur Jersey",
        imageUrl: "https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_880/subzexw0qzkvvjc4nbot/2018-19-tottenham-hotspur-stadium-third-football-shirt-dt4NbF.jpg",
        price: 120,
    },
    {
        productId: 2,
        name: "Tottenham Hotspur Jersey",
        imageUrl: "https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_880/subzexw0qzkvvjc4nbot/2018-19-tottenham-hotspur-stadium-third-football-shirt-dt4NbF.jpg",
        price: 120,
    },
    {
        productId: 3,
        name: "Tottenham Hotspur Jersey",
        imageUrl: "https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_880/subzexw0qzkvvjc4nbot/2018-19-tottenham-hotspur-stadium-third-football-shirt-dt4NbF.jpg",
        price: 120,
    },
    {
        productId: 4,
        name: "Tottenham Hotspur Jersey",
        imageUrl: "https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_880/subzexw0qzkvvjc4nbot/2018-19-tottenham-hotspur-stadium-third-football-shirt-dt4NbF.jpg",
        price: 120,
    },
    {
        productId: 5,
        name: "Tottenham Hotspur Jersey",
        imageUrl: "https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_880/subzexw0qzkvvjc4nbot/2018-19-tottenham-hotspur-stadium-third-football-shirt-dt4NbF.jpg",
        price: 120,
    }
];


export type ProductId = number;

export interface CartItem {
    productId: number;
    imageUrl: string;
    name: string;
    quantity: number;
    total: number;
}

export interface Product {
    productId: ProductId;
    imageUrl: string;
    name: string;
    price: number;
}

export interface CartRecord {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root',
})
export class ShopStateService {
    //PRIVATE VARIABLES
    private cartRecords: Map<ProductId, CartRecord>;
    private _cartItems: CartItem[];
    
    products: Product[];
    cartChanged:BehaviorSubject<CartItem[]>;

    constructor() {
        this.products = sampleProducts;
        this.cartRecords = new Map();
        this._cartItems = [];
        this.cartChanged = new BehaviorSubject<CartItem[]>(this._cartItems)
    }

    //PUBLIC API
    get cartItems(): CartItem[] {
        return this._cartItems;
    }

    addToCart(productId: number) {
        //Does this cart have this product yet? If not... add it
        if (!this.cartRecords.has(productId)) {
            this.cartRecords.set(productId, {
                quantity: 0,
                product: this.products.find(p => p.productId === productId)
            });
        }

        //Increase quantity by one in every case
        this.cartRecords.get(productId).quantity++;

        //We know the cart has changed, so reevaluate the cart display
        this.reevaluateCartItems();
    }

    removeFromCart(productId: number) {
        if (!this.cartRecords.has(productId)) {
            console.log('Tried to delete a product that doesnt exist... please check!')
            return; //Defensive programming here...
        }

        let cartEntry = this.cartRecords.get(productId);
        if (cartEntry.quantity === 1) {
            //Completely delete the product from the cart
            console.log("This shouldn't happen... we disable the '-' button when quantity is 1")
            this.cartRecords.delete(productId);
        } else {
            //Decrement the quantity
            cartEntry.quantity--;
        }

        //We know the cart has changed, so reevaluate the cart display
        this.reevaluateCartItems();
    }

    completelyRemoveFromCart(productId: number) {
        if (!this.cartRecords.has(productId)) {
            console.log('Tried to delete a product that doesnt exist... please check!')
            return; //Defensive programming here...
        }

        this.cartRecords.delete(productId);

        //We know the cart has changed, so reevaluate the cart display
        this.reevaluateCartItems();
    }


    //-------------------------------------------------
    //----------------- Re-evaluate cart --------------
    //-------------------------------------------------

    private reevaluateCartItems() {
        let cartItems: CartItem[] = [];
        this.cartRecords.forEach(entry => {
            let cartItem: CartItem = {
                productId: entry.product.productId,
                imageUrl: entry.product.imageUrl,
                name: entry.product.name,
                quantity: entry.quantity,
                total: entry.quantity * entry.product.price,
            }
            cartItems.push(cartItem);
        });

        //Sort alphabetically
        cartItems = cartItems.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else if (b.name < a.name) {
                return 1;
            }

            return 0;
        });

        this._cartItems = cartItems;
        this.cartChanged.next(this._cartItems);
    }
}