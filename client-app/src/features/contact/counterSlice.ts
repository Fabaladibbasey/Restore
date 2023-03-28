import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 49,
    title: 'Counter'
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementCounter: (state: CounterState, action) => {
            state.data += action.payload;
        },
        decrementCounter: (state: CounterState, action) => {
            state.data -= action.payload;
        }
    }
})

export const { incrementCounter, decrementCounter } = counterSlice.actions;