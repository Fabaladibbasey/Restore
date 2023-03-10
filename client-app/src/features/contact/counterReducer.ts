import { AnyAction } from "redux";

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 0,
    title: 'Counter'
}

//action creators
export const incrementCounter = (number = 1) => {
    return {
        type: 'INCREMENT_COUNTER',
        payload: number
    }
}

export const decrementCounter = (number = 1) => {
    return {
        type: 'DECREMENT_COUNTER',
        payload: number
    }
}

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';


export default function counterReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case INCREMENT_COUNTER:
            return { ...state, data: state.data + 1 }
        case DECREMENT_COUNTER:
            return { ...state, data: state.data - 1 }
        default:
            return state;
    }
}