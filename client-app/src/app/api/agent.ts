import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Pagination } from "../models/pagination";
import { Product, ProductFormValues } from "../models/product";
import { router } from "../routes/Routes";
import { store } from "../store/configureStore";

axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

axios.interceptors.request.use( async config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`;
    return config; 
})

axios.interceptors.response.use(async (res:AxiosResponse) => {
        if (import.meta.env.MODE === 'development') await sleep(300)
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
            console.log("400 error", data);
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title || data.detail);
            break;

        case 401:
            toast.error(data.title);
            break;
        case 403:
            toast.error(data.title || data.detail || "You are not authorized to do this.");
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

function createFormData (body: any) {
    const formData = new FormData();
    for (const property in body) {
        if (property === 'images') {
            for (let i = 0; i < body[property].length; i++) {
                formData.append('images', body[property][i]);
            }
        } else {
            formData.append(property, body[property]);
        }
    }
    return formData;
}

const requests = { 
    get: (url: string, params?: URLSearchParams ) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: FormData) => { 
        return axios.post(url, data, {headers: {'Content-type': 'multipart/form-data'}}).then(responseBody)
    },
    putForm: (url: string, data: FormData) => {
        return axios.put(url, data, {headers: {'Content-type': 'multipart/form-data'}}).then(responseBody)
    }
}

const Admin = {
    createProduct: (product: any) => requests.postForm('products', createFormData(product)),
    updateProduct: (product: any) => requests.putForm('products', createFormData(product)),
    deleteProduct: (id: string) => requests.del(`products/${id}`),
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

const Payments = {
    createPaymentIntent: () => requests.post('payments', {})
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments,
    Admin
}

export default agent;