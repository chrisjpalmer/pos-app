import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ShopPaymentService } from "./shop.payment.service";
import { Product, Cart, ProductId, Receipt } from "./shop.class";

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

export interface CartItem {
    productId: number;
    imageUrl: string;
    name: string;
    quantity: number;
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class ShopStateService {
    //PRIVATE VARIABLES
    private cart:Cart;
    private _cartItems: CartItem[];
    private _total:number;
    private _lastReceipt:Receipt;
    
    products: Product[];
    cartChanged:BehaviorSubject<CartItem[]>;

    constructor(private shopPaymentService:ShopPaymentService) {
        this.products = sampleProducts;
        this.cart = new Cart();

        this._cartItems = [];
        this.cartChanged = new BehaviorSubject<CartItem[]>(this._cartItems)
    }

    //PUBLIC API
    get cartItems(): CartItem[] {
        return this._cartItems;
    }

    get total(): number {
        return this._total;
    }

    get lastReceipt():Receipt {
        return this._lastReceipt;
    }

    addToCart(productId: ProductId) {
        this.cart.addToCart(this.products.find(p => p.productId === productId));

        //We know the cart has changed, so reevaluate the cart display
        this.evaluateCart();
    }

    removeFromCart(productId: ProductId) {
        this.cart.addToCart(this.products.find(p => p.productId === productId));

        //We know the cart has changed, so reevaluate the cart display
        this.evaluateCart();
    }

    completelyRemoveFromCart(productId: ProductId) {
        this.cart.removeFromCart(this.products.find(p => p.productId === productId));

        //We know the cart has changed, so reevaluate the cart display
        this.evaluateCart();
    }

    async commitToPayment() : Promise<void> {
        await this.shopPaymentService.requestPaymentForCart(this.cart);

        //Success!
        let receipt = new Receipt(this.cart);
        this.cart = new Cart();

        this._lastReceipt = receipt;
        this.evaluateCart();
    }


    //-------------------------------------------------
    //----------------- Re-evaluate cart --------------
    //-------------------------------------------------

    private evaluateCart() {
        //Build the cart items
        let cartRecords = this.cart.getCartRecords();
        let cartItems = cartRecords.map(entry => {
            let cartItem: CartItem = {
                productId: entry.product.productId,
                imageUrl: entry.product.imageUrl,
                name: entry.product.name,
                quantity: entry.quantity,
                total: entry.quantity * entry.product.price,
            }
            return cartItem
        });
        cartItems = cartItems.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else if (b.name < a.name) {
                return 1;
            }

            return 0;
        });

        //Build the total
        this._total = this.cart.getTotal();

        //Update any listeners
        this._cartItems = cartItems;
        this.cartChanged.next(this._cartItems);
    }
}