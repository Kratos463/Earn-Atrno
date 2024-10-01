import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from '../helper/configHeader';
import { Member,MemberResponse } from './types/member';

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

interface FriendListItem {
    _id: string;
    reward: number;
    friendsDetails: {
        referralCode: string;
    };
    levelDetails: {
        name: string;
    };
}

interface TapCoinRequest{
    incrementPoint: number
}

interface TapCoinResponse{
    newCoinCount: number,
    success: boolean
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

// Define the asyncThunk for tapCoin
export const tapCoin = createAsyncThunk<
    TapCoinResponse,
    TapCoinRequest,
    { rejectValue: string }
>(
    'member/tapCoin',
    async ({ incrementPoint }, { rejectWithValue }) => {
        try {
            const response = await axios.post<TapCoinResponse>(
                '/api/v1/member/tap-on-coin', 
                { incrementPoint }, 
                configHeader()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while updating the coins", error);
            if (error.response && error.response.data) {
                // Return detailed error message
                return rejectWithValue(error.response.data.message || 'Failed to tap coin');
            }
            return rejectWithValue('Failed to tap coin. Please try again.');
        }
    }
);


// Async thunk for fetching the friend list
export const fetchFriendList = createAsyncThunk<
  FriendListItem[], 
  void, 
  { rejectValue: string }
>(
  "auth/friendList",
  async (_, { rejectWithValue }) => {
    try {
      const config = configHeader()
      const response = await axios.get<{ message?: string; success?: boolean; friendList: FriendListItem[] }>('/api/v1/member/friend-list', config);
      return response.data.friendList;
    } catch (error) {
      console.error("Error while fetching friend list", error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch friend list');
      }
      return rejectWithValue('Fetch friend list failed. Please try again');
    }
  }
);


// for fetch current member details
export const fetchCurrentMember = createAsyncThunk<
    Member,
    void,
    { rejectValue: string }
>(
    "auth/fetchCurrentMember",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<MemberResponse>("/api/v1/member/get-member", configHeader());

            if (response.data.member.length > 0) {
                return response.data.member[0];
            } else {
                return rejectWithValue('No member data found');
            }
        } catch (error) {
            console.error("Error while fetching current member", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch current member');
            }
            return rejectWithValue('Failed to fetch current member. Please try again');
        }
    }
);




interface AuthState {
    user: RegisterOrLoginMemberResponse | null;
    registerLoading: boolean;
    checkWalletLoading: boolean;
    error: string | null;
    isRegistered: boolean;
    friendList: FriendListItem[] | [];
    friendListLoading: boolean;
    currentMemberLoading: boolean,
    member: Member,
    tapCoinLoading: boolean
}

const initialState: AuthState = {
    user: null,
    registerLoading: false,
    isRegistered: false,
    checkWalletLoading: false,
    error: null,
    friendList: [],
    friendListLoading: false,
    currentMemberLoading: false,
    member:{} as Member,
    tapCoinLoading: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            // Reset the auth state
            state.user = null;
            state.error = null;
            state.isRegistered = false;
            state.friendList = [];
            state.member = {} as Member; // Reset the member details
            state.registerLoading = false;
            state.checkWalletLoading = false;
            state.friendListLoading = false;
            state.currentMemberLoading = false;
            state.tapCoinLoading = false;
        },
    },
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
            })
            .addCase(fetchFriendList.pending, (state) => {
                state.friendListLoading = true;
                state.error = null
            })
            .addCase(fetchFriendList.fulfilled, (state, action: PayloadAction<FriendListItem[]>) => {
                state.friendListLoading = false;
                state.friendList = action.payload;
                state.error = null;
            })
            .addCase(fetchFriendList.rejected, (state, action) => {
                state.friendListLoading = false;
                state.error = action.payload || "An unknown error occurred"
            })
            .addCase(fetchCurrentMember.pending, (state)=> {
                state.currentMemberLoading = true,
                state.error = null
            })
            .addCase(fetchCurrentMember.fulfilled, (state, action: PayloadAction<Member>)=>{
                state.currentMemberLoading= false,
                state.error = null
                state.member = action.payload
            })
            .addCase(fetchCurrentMember.rejected, (state, action)=> {
                state.currentMemberLoading = false,
                state.error = action.payload || "An unknown error occurred"
            })
            .addCase(tapCoin.pending, (state) => {
                state.tapCoinLoading = true;
                state.error = null;
            })
            .addCase(tapCoin.fulfilled, (state, action) => {
                state.tapCoinLoading = false;
            })
            .addCase(tapCoin.rejected, (state, action) => {
                state.tapCoinLoading = false;
                state.error = action.payload as string;
            })
            ;
    },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
