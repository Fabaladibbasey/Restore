import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const {
    selectAll: selectProducts,
    selectById: selectProductById
} = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    "catalog/fetchProducts",
    async (_, thunkApi) => {
        try {
            return await agent.Catalog.list();
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    }
);

export const fetchProductAsync = createAsyncThunk<Product, string>(
    "catalog/fetchProduct",
    async (productId, thunkApi) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    }
);


export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: "idle"
    }),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingForProducts";
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = "succeeded";
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action);
            state.status = "failed";
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = "pendingForProduct";
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = "succeeded";
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = "failed";
        });
    }
});

