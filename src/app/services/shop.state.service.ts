import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ShopPaymentService } from "./shop.payment.service";
import { Product, Cart, ProductId, Receipt, CartData } from "./shop.class";

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

@Injectable({
    providedIn: 'root',
})
export class ShopStateService {
    //PRIVATE VARIABLES
    private cart:Cart;
    private _lastReceipt:Receipt;
    
    products: Product[];
    cartChanged:BehaviorSubject<CartData>;

    constructor(private shopPaymentService:ShopPaymentService) {
        this.products = sampleProducts;
        this.cart = new Cart();

        this.cartChanged = new BehaviorSubject<CartData>(this.cart.getCartData())
    }

    //PUBLIC API
    get lastReceipt():Receipt {
        return this._lastReceipt;
    }

    addToCart(productId: ProductId) {
        this.cart.addToCart(this.products.find(p => p.productId === productId));
        this.emitCartChanged(); //Alert that the cart has changed.
    }

    removeFromCart(productId: ProductId) {
        this.cart.removeFromCart(this.products.find(p => p.productId === productId));
        this.emitCartChanged(); //Alert that the cart has changed.
    }

    completelyRemoveFromCart(productId: ProductId) {
        this.cart.completelyRemoveFromCart(this.products.find(p => p.productId === productId));
        this.emitCartChanged(); //Alert that the cart has changed.
    }

    async commitToPayment() : Promise<void> {
        //Send the cart to the payment terminal
        await this.shopPaymentService.requestPaymentForCart(this.cart);

        //Upon payment success generate a receipt for this cart and store
        let receipt = new Receipt(this.cart);
        this._lastReceipt = receipt;

        //Create a brand new cart
        this.cart = new Cart();

        this.emitCartChanged(); //Alert that the cart has changed.
    }

    emitCartChanged() {
        this.cartChanged.next(this.cart.getCartData())
    }
}