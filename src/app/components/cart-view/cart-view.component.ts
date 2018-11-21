import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShopStateService, CartRecord, CartData } from '../../services';

@Component({
  selector: 'cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent {

  constructor() { }

  @Input()
  cartData:CartData;

  @Input()
  isLiveCart: boolean;

  @Output()
  cartRemoveClick = new EventEmitter<CartRecord>();

  @Output()
  cartMinusClick = new EventEmitter<CartRecord>();

  @Output()
  cartPlusClick = new EventEmitter<CartRecord>();

  @Output()
  checkoutClick = new EventEmitter();

  cartRemoveClicked(cartRecord: CartRecord) {
    if (this.isLiveCart) {
      this.cartRemoveClick.emit(cartRecord);
    }
  }

  cartMinusClicked(cartRecord: CartRecord) {
    if (this.isLiveCart) {
      this.cartMinusClick.emit(cartRecord);
    }
  }

  cartPlusClicked(cartRecord: CartRecord) {
    if (this.isLiveCart) {
      this.cartPlusClick.emit(cartRecord);
    }
  }

  checkoutClicked() {
    if(this.isLiveCart) {
      this.checkoutClick.emit();
    }
  }

}
