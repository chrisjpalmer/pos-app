import { Injectable } from "@angular/core";
import { Cart } from "./shop.class";
import { Subject } from "rxjs";

/**
 * The interface of interacting with our fake payment terminal
 */
export interface PaymentRequest {
    event:'purchase';
    amount:number;
}

/**
 * Manages payment by abstracting away the payment terminal
 */
@Injectable({providedIn:'root'})
export class ShopPaymentService {
    /**
     * The websocket which connects to the fake payment terminal
     */
    private paymentTerminalConnection:WebSocket;

    /**
     * Emits messages from the payment terminal
     */
    private paymentTerminalMessageSubject:Subject<string>;

    constructor() {
        //On init, connect to the payment terminal AND setup the paymentTerminal message subject
        this.paymentTerminalMessageSubject = new Subject<string>();
        this.paymentTerminalConnection = new WebSocket('ws://demos.kaazing.com/echo');
        this.paymentTerminalConnection.onmessage = (data) => {
            this.paymentTerminalMessageSubject.next(data.data);
        }
    }

    /**
     * send the cart to the payment terminal so that the user can pay for their cart.
     * @param cart 
     */
    awaitPaymentOfCart(cart:Cart) : Promise <void> {
        //Get the cart total
        let { total } = cart.getCartData();

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