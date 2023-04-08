import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Pagination } from "../models/pagination";
import { Product } from "../models/product";
import { router } from "../routes/Routes";
import { store } from "../store/configureStore";

axios.defaults.baseURL = 'http://localhost:5070/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

axios.interceptors.request.use( async config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`;
    return config; 
})

axios.interceptors.response.use(async (res:AxiosResponse) => {
        await sleep(500);
        const pagination = res.headers['pagination'];
        if (pagination) {
            res.data = {
                items: res.data,
                metaData: JSON.parse(pagination)
            }
        }
        return res as AxiosResponse<Pagination<Product>>;
}, (error: AxiosError) => {

    const {data, status} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;

        case 401:
            toast.error(data.title);
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;        
    }

    return Promise.reject(error);
})


const requests = { 
    get: (url: string, params?: URLSearchParams ) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params ),
    details: (id: string) => requests.get(`products/${id}`),
    create: (product: any) => requests.post('products', product),
    update: (product: any) => requests.put(`products/${product.id}`, product),
    delete: (id: string) => requests.del(`products/${id}`),
    fetchFilters: () => requests.get('products/filters'),
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

const Basket = {
    get: () => requests.get('basket'),
    upsertItem: (productId: number, quantity = 1) => requests.put(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.del(`basket?productId=${productId}&quantity=${quantity}`),
}

const Account = {
    currentUser: () => requests.get('account/currentUser'),
    login: (user: any) => requests.post('account/login', user),
    register: (user: any) => requests.post('account/register', user),
}

const Orders = {
    list: () => requests.get('orders'),
    details: (id: string) => requests.get(`orders/${id}`),
    create: (order: any) => requests.post('orders', order),
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders
}

export default agent;