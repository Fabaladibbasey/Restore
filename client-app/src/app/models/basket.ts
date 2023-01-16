export interface Basket {
    id: string;
    buyerId: string;
    items: BasketItem[];
    subTotal: number;
}
export interface BasketItem {
    quantity: number;
    productId: number;
    productName: string;
    price: number;
    pictureUrl: string;
    brand: string;
    type: string;
}
