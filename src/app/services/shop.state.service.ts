import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ShopPaymentService } from "./shop.payment.service";
import { Product, Cart, ProductId, Receipt, CartData } from "./shop.class";
import { SampleProducts } from "./shop.sample.products";

/**
 * Service Class which abstracts the shop state from the controllers layer.
 * It manages the active cart and provides methods for manipulating the cart.
 */
@Injectable({
    providedIn: 'root',
})
export class ShopStateService {
    //PRIVATE API
    private cart:Cart;
    private _lastReceipt:Receipt;

    /**
     * convenience method to alert listeners of cartChanged event
     */
    private emitCartChanged() {
        this.cartChanged.next(this.cart.getCartData())
    }

    constructor(private shopPaymentService:ShopPaymentService) {
        this.products = SampleProducts;
        this.cart = new Cart();

        this.cartChanged = new BehaviorSubject<CartData>(this.cart.getCartData())
    }

    //PUBLIC API

    /**
     * The total list of products that can be sold at this shop
     */
    products: Product[];
    /**
     * Can be subscribed to by controllers to detect when the cart data has changed.
     */
    cartChanged:BehaviorSubject<CartData>;

    /**
     * gets the last receipt of the last payment that was made
     */
    getLastReceipt():Receipt {
        return this._lastReceipt;
    }

    /**
     * increments a product's quantity in the cart
     * @param product 
     */
    addToCart(product: Product) {
        this.cart.addToCart(product);
        this.emitCartChanged(); //Alert that the cart has changed.
    }

    /**
     * decrements a product's quantity from the cart
     * @param product 
     */
    removeFromCart(product: Product) {
        this.cart.removeFromCart(product);
        this.emitCartChanged(); //Alert that the cart has changed.
    }

    /**
     * completely removes the item from the cart
     * @param product 
     */
    completelyRemoveFromCart(product: Product) {
        this.cart.completelyRemoveFromCart(product);
        this.emitCartChanged(); //Alert that the cart has changed.
    }

    /**
     * submits the active cart to the payment terminal and waits for successful response
     */
    async awaitPayment() : Promise<void> {
        //Send the cart to the payment terminal
        await this.shopPaymentService.awaitPaymentOfCart(this.cart);

        //Upon payment success generate a receipt for this cart and store
        let receipt = new Receipt(this.cart);
        this._lastReceipt = receipt;

        //Create a brand new cart
        this.cart = new Cart();

        this.emitCartChanged(); //Alert that the cart has changed.
    }
}