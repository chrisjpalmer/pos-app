import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShopStateService, CartRecord, CartData } from '../../services';

/**
 * CartViewComponent displays the value of [cartData]
 * if [isLiveCart] is true, CartViewComponent displays buttons for manipulating the cart 
 * AND exposes clicks to these buttons as output events
 */
@Component({
  selector: 'cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent {

  constructor() { }

  /**
   * The CartData to display in this component
   */
  @Input()
  cartData:CartData;

  /**
   * When true, enables the cart buttons
   */
  @Input()
  isLiveCart: boolean = false;

  /**
   * User clicked remove for a particular CartRecord
   */
  @Output()
  cartRemoveClick = new EventEmitter<CartRecord>();

  /**
   * User clicked minus for a particular CartRecord
   */
  @Output()
  cartMinusClick = new EventEmitter<CartRecord>();

  /**
   * User clicked plus for a particular CartRecord
   */
  @Output()
  cartPlusClick = new EventEmitter<CartRecord>();

  /**
   * User clicked the checkout button
   */
  @Output()
  checkoutClick = new EventEmitter();

  //PRIVATE EVENT HANDLERS to process cart button clicks

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
