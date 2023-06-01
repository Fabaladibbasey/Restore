import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: "idle" | "pendingForProducts" | "pendingForProduct" | "pendingForFilters" | "succeeded" | "failed";
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

export const getAxiosParams = (productParams: ProductParams) => {
    const params = new URLSearchParams();
    Object.entries(productParams).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
        if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
            params.delete(key);
        }
    });
    return params;
};

export const {
    selectAll: selectProducts,
    selectById: selectProductById
} = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    "catalog/fetchProducts",
    async (_, thunkApi) => {
        const params = getAxiosParams(thunkApi.getState().catalog.productParams);
        try {
            const response = await agent.Catalog.list(params);
            thunkApi.dispatch(catalogSlice.actions.setMetaData(response.metaData));
            return response.items;
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

export const fetchFiltersAsync = createAsyncThunk(
    "catalog/fetchFilters",
    async (_, thunkApi) => {
        try {
            return await agent.Catalog.fetchFilters();
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    }
);

function initParams () {
    return {
        orderBy: "name",
        pageNumber: 1,
        pageSize: 6,
    }
}


export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: "idle",
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null,
    }),
    reducers: {
        setProductParams: (state, action) => {            
            state.productsLoaded = false;     
            if (action.payload.pageNumber === undefined) {
                state.productParams.pageNumber = 1;
            }
            state.productParams = {...state.productParams, ...action.payload};
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        
        setProduct: (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.productsLoaded = false; // to force reload of products inorder to correctly update the pagination and which made above line of code unnecessary
        },

        removeProduct: (state, action) => {
            productsAdapter.removeOne(state, action.payload);
            state.productsLoaded = false; // to force reload of products inorder to correctly update the pagination and which made above line of code unnecessary
        }
    
    },
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

        builder.addCase(fetchFiltersAsync.pending, (state) => {
            state.status = "pendingForFilters";
        });

        builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.status = "succeeded";
            state.filtersLoaded = true;
        });

        builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
            state.status = "failed",
            console.log(action.payload)
        })
    }
});

export const { setProductParams, resetProductParams, setProduct, removeProduct } = catalogSlice.actions;

