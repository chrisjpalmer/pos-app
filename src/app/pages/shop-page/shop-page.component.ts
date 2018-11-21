import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopStateService, Product, CartRecord, CartData } from "../../services";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

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
        //We get the full list of products from ShopStateService
        this.products = this.shopStateService.products;
    }

    ngOnInit() {
        this.cartChangedSub = this.shopStateService.cartChanged.subscribe(cartData => this.cartData = cartData);
    }

    ngOnDestroy() {
        this.cartChangedSub.unsubscribe();
    }

    productClicked(product: Product) {
        this.shopStateService.addToCart(product.productId);
    }

    cartRemoveClicked(cartRecord: CartRecord) {
        this.shopStateService.completelyRemoveFromCart(cartRecord.product.productId);
    }

    cartMinusClicked(cartRecord: CartRecord) {
        this.shopStateService.removeFromCart(cartRecord.product.productId);
    }

    cartPlusClicked(cartRecord: CartRecord) {
        this.shopStateService.addToCart(cartRecord.product.productId);
    }

    async checkoutClicked() {
        await this.shopStateService.commitToPayment();

        this.router.navigate(['/receipt']);
    }
}