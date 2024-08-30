import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from '../helper/configHeader';

// Define interfaces for API request and response
interface RegisterOrLoginMemberRequest {
    walletAddress: string;
    country?: string;
    rbcode?: string;
}

interface RegisterOrLoginMemberResponse {
    message: string;
    success: boolean;
    token: string;
}

interface CheckWalletRequest {
    walletAddress: string;
}

interface CheckWalletResponse {
    message: string;
    success: boolean;
    isRegistered: boolean;
}

// Async thunk for registering or logging in the member
export const registerOrLoginMember = createAsyncThunk<
    RegisterOrLoginMemberResponse,
    RegisterOrLoginMemberRequest,
    { rejectValue: string }
>(
    "auth/registerOrLoginMember",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post<RegisterOrLoginMemberResponse>("/api/v1/member/register-member", formData, configHeader());
            return response.data;
        } catch (error) {
            console.error("Error in registration or login process:", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "An error occurred");
            }
            return rejectWithValue("Registration or login failed. Please try again.");
        }
    }
);

// Async thunk to check if a wallet is registered
export const checkWallet = createAsyncThunk<
    CheckWalletResponse,
    CheckWalletRequest,
    { rejectValue: string }
>(
    "auth/checkWallet",
    async ({ walletAddress }, { rejectWithValue }) => {
        try {
            const response = await axios.get<CheckWalletResponse>(`/api/v1/member/check-wallet`, {
                params: { walletAddress },
                ...configHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error in check wallet register process:", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'Failed to check wallet registration');
            }
            return rejectWithValue('Check wallet registration failed. Please try again.');
        }
    }
);

interface AuthState {
    user: RegisterOrLoginMemberResponse | null;
    registerLoading: boolean;
    checkWalletLoading: boolean;
    error: string | null;
    isRegistered: boolean;
}

const initialState: AuthState = {
    user: null,
    registerLoading: false,
    isRegistered: false,
    checkWalletLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerOrLoginMember.pending, (state) => {
                state.registerLoading = true;
                state.error = null;
            })
            .addCase(registerOrLoginMember.fulfilled, (state, action: PayloadAction<RegisterOrLoginMemberResponse>) => {
                state.registerLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerOrLoginMember.rejected, (state, action) => {
                state.registerLoading = false;
                state.error = action.payload || "An unknown error occurred";
            })
            .addCase(checkWallet.pending, (state) => {
                state.checkWalletLoading = true;
                state.error = null;
            })
            .addCase(checkWallet.fulfilled, (state, action: PayloadAction<CheckWalletResponse>) => {
                state.checkWalletLoading = false;
                state.isRegistered = action.payload.isRegistered;
                state.error = null;
            })
            .addCase(checkWallet.rejected, (state, action) => {
                state.checkWalletLoading = false;
                state.error = action.payload || "An unknown error occurred";
            });
    },
});

export default authSlice.reducer;
