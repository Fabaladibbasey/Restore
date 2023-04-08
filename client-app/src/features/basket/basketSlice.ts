import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import agent from "../../app/api/agent"
import { Basket } from "../../app/models/basket"

interface BasketState {
    basket: Basket | null,
    status : string;
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const fetchBasketAsync = createAsyncThunk<Basket, void>(
    'basket/fetchBasketAsync', 
    async (_, thunkApi) => {
        try {
            return await agent.Basket.get()
        } catch (error: any) {
            return thunkApi.rejectWithValue({error: error.data})
        }
    }
)

export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async ({productId, quantity = 1}, thunkApi) => {
        try {
            return await agent.Basket.upsertItem(productId, quantity)
        } catch (error: any) {
            return thunkApi.rejectWithValue({error: error.data})
        }
    }
)

export const removeItemFromBasketAsync = createAsyncThunk<void, {productId: number, quantity: number, name?: string}>(
    'basket/removeItemFromBasketAsync',
    async ({productId, quantity}, thunkApi) => {
        try {
            await agent.Basket.removeItem(productId, quantity)
        } catch (error: any) {
            return thunkApi.rejectWithValue({error: error.data})
        }
    }
)


export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state: BasketState, action) => {
            state.basket = action.payload
        },
        clearBasket : (state: BasketState) => {
            state.basket = null
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(addBasketItemAsync.pending, (state: BasketState, action) => {                
                state.status = 'pendingAddItem' + action.meta.arg.productId
            })
            .addCase(removeItemFromBasketAsync.pending, (state: BasketState, action) => {
                state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name
            })
            .addCase(removeItemFromBasketAsync.fulfilled, (state: BasketState, action) => {

                const {productId, quantity} = action.meta.arg;
                const item = state.basket?.items.find(x => x.productId === productId)
                if (item) {
                    item.quantity -= quantity
                    if(item.quantity < 1){
                        state.basket!.items = state.basket!.items.filter(x => x.productId !== productId)
                    }
                }
                state.basket!.subTotal = state.basket!.items.reduce((a, b) => (b.price * b.quantity) + a, 0)
                state.status = 'idle'
            })
            .addCase(removeItemFromBasketAsync.rejected, (state: BasketState, action) => {
                console.log(action);
                state.status = 'failed'
            })

            builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled ), (state: BasketState, action) => {
                state.status = 'idle'
                state.basket = action.payload
            })
            .addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected ), (state: BasketState, action) => {
                console.log(action);
                state.status = 'failed'
            })
    }
})

export const { setBasket, clearBasket } = basketSlice.actions
