import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { Order } from "../../app/models/order";

interface OrderState {
    order: Order | null,
    orders : Order[],
    errors: any,
    status : 'idle' | 'pending' | 'succeeded' | 'failed',
    orderLoaded: boolean,
    ordersLoaded: boolean,
}

const initialState: OrderState = {
    order: null,
    orders: [],
    errors: null,
    status: 'idle',
    orderLoaded: false,
    ordersLoaded: false,
}

export const createOrder = createAsyncThunk<Order, FieldValues>(
    'order/createOrder',
    async (data, thunkApi) => {
        try {
            return await agent.Orders.create(data)
        } catch (errors: any) {
            return thunkApi.rejectWithValue({errors})
        }
    }
)

export const getOrder = createAsyncThunk<Order, string>(
    'order/getOrder',
    async (id, thunkApi) => {
        try {
            return await agent.Orders.details(id)
        } catch (errors: any) {
            return thunkApi.rejectWithValue({errors})
        }
    }
)

export const getOrders = createAsyncThunk<Order[], void>(
    'order/getOrders',
    async (_, thunkApi) => {
        try {
            return await agent.Orders.list()
        } catch (errors: any) {
            return thunkApi.rejectWithValue({errors})
        }
    }
)


export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrder: (state, action: PayloadAction<Order>) => {
            state.order = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(createOrder.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.order = action.payload
        })
        builder.addCase(createOrder.rejected, (state, action) => {
            state.status = 'failed'
            state.errors = action.payload
        })
        builder.addCase(getOrder.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(getOrder.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.order = action.payload
            state.orderLoaded = true
        })
        builder.addCase(getOrder.rejected, (state, action) => {
            state.status = 'failed'
            state.errors = action.payload
        })
        builder.addCase(getOrders.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.orders = action.payload
            state.ordersLoaded = true
        })
        builder.addCase(getOrders.rejected, (state, action) => {
            state.status = 'failed'
            state.errors = action.payload
        })
    }
})


export const { setOrder } = orderSlice.actions

