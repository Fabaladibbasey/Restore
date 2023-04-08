import { Basket } from "./basket";
import { ShippingAddress } from "./order";

export interface User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
    basket?: Basket,
    userAddress? : ShippingAddress
}