import { getConfig } from "@/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Cookies from 'js-cookie'

// Define interfaces for API requests and responses
interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    message: string;
}

interface Admin{
    _id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
    isDisabled: boolean;
    isEmailVerified: boolean; 
    createdAt: string;
}

interface AdminDetailsResponse {
   status: boolean,
   message: string,
   admin: Admin
}

// Define the authentication state interface
interface AuthState {
    isLoading: boolean;
    error: string | null;
    token: string | null;
    adminDetails: Admin | null;
}

// Initial state for authentication
const initialState: AuthState = {
    isLoading: false,
    error: null,
    token: null,
    adminDetails: null,
};

// Async thunk for logging in
export const login = createAsyncThunk<LoginResponse, LoginRequest>(
    "auth/login",
    async (credentials) => {
        try {
            const response = await axios.post<LoginResponse>(
                `${process.env.API_URL}/api/v1/admin/login`,
                credentials,
                getConfig()
            );
            Cookies.set('token', response.data.token, { expires: 1 }); 
            return response.data;
        } catch (error) {
            throw new Error("Login failed. Please check your credentials.");
        }
    }
);

// Async thunk for registering
export const register = createAsyncThunk<RegisterResponse, RegisterRequest>(
    "auth/register",
    async (userData) => {
        try {
            const response = await axios.post<RegisterResponse>(
                `${process.env.API_URL}/api/v1/admin/register`,
                userData,
                getConfig()
            );
            return response.data;
        } catch (error) {
            throw new Error("Registration failed. Please try again.");
        }
    }
);

// Async thunk for fetching admin details
export const fetchAdminDetails = createAsyncThunk<AdminDetailsResponse>(
    "auth/fetchAdminDetails",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<AdminDetailsResponse>(
                `${process.env.API_URL}/api/v1/admin/fetch-admin`,
                getConfig()
            );
            return response.data; 
        } catch (error) {
            throw new Error("Failed to fetch admin details");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            // Clear auth state on logout
            state.isLoading = false;
            state.error = null;
            state.token = null;
            state.adminDetails = null;
            Cookies.remove('token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Reducers for login action
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Login failed.";
            })
            // Reducers for register action
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Registration failed.";
            })
            // Reducers for fetchAdminDetails action
            .addCase(fetchAdminDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminDetails = action.payload.admin;
            })
            .addCase(fetchAdminDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Failed to fetch admin details.";
            });
    },
});

// Export actions
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
