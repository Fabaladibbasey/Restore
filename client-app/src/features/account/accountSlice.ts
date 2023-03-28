import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { router } from "../../app/routes/Routes";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null,
    errors: any
}

const initialState: AccountState = {
    user: null,
    errors: null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkApi) => {
        try {
            const userDto: User  = await agent.Account.login(data)
            const {basket, ...user} = userDto;
            if (basket) thunkApi.dispatch(setBasket(basket))
            return user;
        } catch (error: any) {
            return thunkApi.rejectWithValue({error: error.response.data})
        }
    }
)

export const registerUser = createAsyncThunk<User, FieldValues>(
    'account/registerUser',
    async (data, thunkApi) => {
        try {
            return await agent.Account.register(data)
        } catch (errors: any) {
            return thunkApi.rejectWithValue({errors})
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/currentUser',
    async (_, thunkApi) => {
        thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)))
        try {
            const userDto = await agent.Account.currentUser();            
            const {basket, ...user} = userDto;
            if (basket) thunkApi.dispatch(setBasket(basket))
            return user;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem("user")) return false;
        }
    }
)

export const logoutUser = createAsyncThunk<null, void>(
    'account/logoutUser',
    async (_, thunkApi) => {
        try {
            thunkApi.dispatch(setUser(null))
            thunkApi.dispatch(setBasket(null))
            localStorage.removeItem('user')
            router.navigate('/')
            return null;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, () => {
            toast.success("Registration successful")
            router.navigate('/login')
        })
        .addCase(registerUser.rejected, (state, action: any) => {
            state.errors = action.payload.errors
        })
        .addCase(signInUser.fulfilled, () => {
            toast.success("Login successful")
        })
        .addCase(signInUser.rejected, (state, action: any) => {
            state.errors = action.payload.error
        })

        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(state.user))
        })

        builder.addMatcher(isAnyOf(signInUser.rejected, registerUser.rejected, fetchCurrentUser.rejected), (state) => {
            state.user = null
            localStorage.removeItem('user')
        })
    }
})

export const { setUser } = accountSlice.actions

