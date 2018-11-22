
/**
 * Define product id as a number
 */
export type ProductId = number;

/**
 * Defines a product that can be purchased
 */
export interface Product {
    productId: ProductId;
    imageUrl: string;
    name: string;
    price: number;
}

/**
 * Associates the Product with a Quantity the getTotal() method
 */
export class CartRecord {
    constructor(public product: Product) {};
    quantity: number = 0;

    getTotal() {
        return this.product.price * this.quantity;
    }
}

/**
 * Controllers do not interact with the Cart directly..., however they can obtain information about it through this class
 */
export interface CartData {
    cartRecords:CartRecord[];
    total:number;
}

/**
 * Wraps a Cart and associates it with a timestamp at which the purchase was made for the cart.
 */
export class Receipt {
    timestamp:Date;
    constructor(private cart:Cart) {
        this.timestamp = new Date();
    }

    /**
     * Expose information about the cart without exposing the cart
     */
    getCartData() {
        return this.cart.getCartData();
    }
}

/**
 * Models a shopping cart. This class contains service methods for adding, removing and deleting things from the cart.
 * The cart should only be interacted by service layer.
 */
export class Cart {
    private cartRecords: Map<ProductId, CartRecord> = new Map();

    addToCart(product:Product) {
        //Does this cart have this product yet? If not... add it
        if (!this.cartRecords.has(product.productId)) {
            this.cartRecords.set(product.productId, new CartRecord(product));
        }

        //Increase quantity by one in every case
        this.cartRecords.get(product.productId).quantity++;
    }

    removeFromCart(product: Product) {
        if (!this.cartRecords.has(product.productId)) {
            console.log('Tried to delete a product that doesnt exist... please check!')
            return; //Defensive programming here...
        }

        let cartEntry = this.cartRecords.get(product.productId);
        if (cartEntry.quantity === 1) {
            //Completely delete the product from the cart
            console.log("This shouldn't happen... we disable the '-' button when quantity is 1")
            return
        }

        //Decrement the quantity
        cartEntry.quantity--;
    }

    completelyRemoveFromCart(product: Product) {
        if (!this.cartRecords.has(product.productId)) {
            console.log('Tried to delete a product that doesnt exist... please check!')
            return; //Defensive programming here...
        }

        this.cartRecords.delete(product.productId);
    }

    getCartData() {
        let cartData:CartData = {
            total: this.getTotal(),
            cartRecords: this.getCartRecords(),
        }
        return cartData;
    }

    private getTotal() {
        let total = 0;
        this.cartRecords.forEach(record => {
            total += record.getTotal();
        });
        return total;
    }

    private getCartRecords() {
        let records:CartRecord[] = [];
        this.cartRecords.forEach(record => records.push(record));
        records = records.sort((a, b) => {
            if (a.product.name < b.product.name) {
                return -1;
            } else if (b.product.name < a.product.name) {
                return 1;
            }

            return 0;
        });
        return records
    }
}