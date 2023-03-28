import { Basket } from "./basket";

export interface User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
    basket?: Basket
}