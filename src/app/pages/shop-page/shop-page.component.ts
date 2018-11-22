import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopStateService, Product, CartRecord, CartData } from "../../services";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

/**
 * The main page displayed at /shop
 */
@Component({
    selector: 'shop-page',
    templateUrl: './shop-page.component.html',
    styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit, OnDestroy {
    products: Product[];
    cartData:CartData;
    private cartChangedSub:Subscription;


    constructor(private shopStateService: ShopStateService, private router: Router) {
        
    }

    ngOnInit() {
        //Personally I prefer to pull data out of service classes in the ngOnInit function.
        //Sometimes pulling data from the service class requires an asynchronous call and you cannot us await operator in the constructor.

        //Pull data out of the service class and into the the controller
        this.products = this.shopStateService.products;

        //Subscribe to events from the shopStateService class... when the cart gets updated we store the cartData in the controller.
        this.cartChangedSub = this.shopStateService.cartChanged.subscribe(cartData => this.cartData = cartData);
        //this.shopStateService.addToCart(this.products[0].productId); //TESTING ADD ONE TO CART
    }

    ngOnDestroy() {
        //To help out the garbage collector, free the subscription when this view gets removed 
        this.cartChangedSub.unsubscribe();
    }

    /**
     * productClicked - add the product to the cart
     * @param product 
     */
    productClicked(product: Product) {
        this.shopStateService.addToCart(product);
    }

    /**
     * remove button is clicked - remove the item completely from the cart 
     * @param cartRecord 
     */
    cartRemoveClicked(cartRecord: CartRecord) {
        this.shopStateService.completelyRemoveFromCart(cartRecord.product);
    }

    /**
     * minus button is clicked - decrement the item's quantity
     * @param cartRecord 
     */
    cartMinusClicked(cartRecord: CartRecord) {
        this.shopStateService.removeFromCart(cartRecord.product);
    }

    /**
     * plus button is clicked - increment the item's quantity
     * @param cartRecord 
     */
    cartPlusClicked(cartRecord: CartRecord) {
        this.shopStateService.addToCart(cartRecord.product);
    }

    /**
     * The user wishes to go to the checkout.
     */
    async checkoutClicked() {
        await this.shopStateService.awaitPayment();

        this.router.navigate(['/receipt']);
    }
}