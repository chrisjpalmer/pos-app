export type ProductId = number;

export interface Product {
    productId: ProductId;
    imageUrl: string;
    name: string;
    price: number;
}

export interface CartRecord {
    product: Product;
    quantity: number;
}

export class Cart {
    cartRecords: Map<ProductId, CartRecord> = new Map();

    addToCart(product:Product) {
        //Does this cart have this product yet? If not... add it
        if (!this.cartRecords.has(product.productId)) {
            this.cartRecords.set(product.productId, {
                quantity: 0,
                product: product
            });
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

    getTotal() {
        let total = 0;
        this.cartRecords.forEach(record => {
            total += record.quantity * record.product.price;
        });
        return total;
    }

    getCartRecords() {
        let records:CartRecord[] = [];
        this.cartRecords.forEach(record => records.push(record));
        return records;
    }
}

export class Receipt {
    timestamp:Date;
    constructor(public cart:Cart) {
        this.timestamp = new Date();
    }
}