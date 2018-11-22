import { Component, OnInit } from '@angular/core';
import { ShopStateService, Receipt, CartData } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})
export class ReceiptPageComponent implements OnInit {
  
  receipt:Receipt;
  cartData:CartData;

  constructor(private shopStateService:ShopStateService, private router:Router) { }

  ngOnInit() {
    //Personally I prefer to pull data out of service classes in the ngOnInit function.
    //Sometimes pulling data from the service class requires an asynchronous call and you cannot us await operator in the constructor.

    //Pull the last receipt from the shop state... this is what we will display
    let receipt = this.shopStateService.getLastReceipt();
    if(!receipt) {
      //The receipt object contains nothing... redirect to the shop
      this.router.navigate(['shop']);
      return;
    }

    //cart data from the receipt object
    this.receipt = receipt;
    this.cartData = this.receipt.getCartData();
  }

}
