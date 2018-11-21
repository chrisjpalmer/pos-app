import { Injectable } from "@angular/core";
import { Cart } from "./shop.class";
import { Subject } from "rxjs";

export interface PaymentRequest {
    event:'purchase';
    amount:number;
}


@Injectable({providedIn:'root'})
export class ShopPaymentService {
    private paymentTerminalConnection:WebSocket;

    private paymentTerminalMessageSubject:Subject<string>;

    constructor() {
        this.paymentTerminalMessageSubject = new Subject<string>();
        this.paymentTerminalConnection = new WebSocket('ws://demos.kaazing.com/echo');
        this.paymentTerminalConnection.onmessage = (data) => {
            this.paymentTerminalMessageSubject.next(data.data);
        }
    }

    requestPaymentForCart(cart:Cart) : Promise <void> {
        //Get the cart total
        let total = cart.getTotal();

        //Form the request and send
        let request:PaymentRequest = {
            event:'purchase',
            amount:total
        }
        this.paymentTerminalConnection.send(JSON.stringify(request));

        //Wait until data is recieved from the payment terminal
        return new Promise((resolve, reject) => {
            let subscription = this.paymentTerminalMessageSubject.subscribe((data) => {
                console.log("Recieved from payment terminal: " + data);
                subscription.unsubscribe(); //remove the subscription and resolve the promise
                resolve();
            })
        })
    }
}