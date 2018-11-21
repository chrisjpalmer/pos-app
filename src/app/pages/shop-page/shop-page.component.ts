import { Component } from "@angular/core";
import { ShopStateService, Product, CartItem } from "../../services";

@Component({
    selector: 'shop-page',
    templateUrl: './shop-page.component.html',
    styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent {
    products:Product[];
    cartItems:CartItem[];


    constructor(private shopStateService:ShopStateService) {
        //We get the full list of products from ShopStateService
        this.products = this.shopStateService.products;

        //This is nice because we might one day choose to siphon off the cart display functionality into a standard component.
        //In which case it could subscribe to shopStateService and be kept up to date with the cart.
        this.shopStateService.cartChanged.subscribe(cartItems => this.cartItems = cartItems);
    }

    cartRemoveClicked(cartItem:CartItem) {
        this.shopStateService.completelyRemoveFromCart(cartItem.productId);
    }

    cartMinusClicked(cartItem:CartItem) {
        this.shopStateService.removeFromCart(cartItem.productId);
    }

    cartPlusClicked(cartItem:CartItem) {
        this.shopStateService.addToCart(cartItem.productId);
    }

    productClicked(product:Product) {
        this.shopStateService.addToCart(product.productId);
    }

    checkoutClicked() {

    }
}