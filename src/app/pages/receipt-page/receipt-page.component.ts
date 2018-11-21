import { Component, OnInit } from '@angular/core';
import { ShopStateService, Receipt } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})
export class ReceiptPageComponent implements OnInit {

  private receipt:Receipt;

  constructor(private shopStateService:ShopStateService, private router:Router) { }

  ngOnInit() {
    let receipt = this.shopStateService.lastReceipt;
    if(!receipt) {

      //The receipt object contains nothing... redirect to the shop
      this.router.navigate(['shop']);
      return;
    }
    this.receipt = receipt;
  }

}
