export interface ShippingAddress {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
}

export interface OrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    buyerId: string;
    orderDate: string;
    shipToAddress: ShippingAddress;
    deliveryFee: number;
    orderItems: OrderItem[];
    status: string;
    subtotal: number;
    total: number;
}

