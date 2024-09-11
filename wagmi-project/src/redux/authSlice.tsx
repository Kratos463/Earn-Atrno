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
    member: Member
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
            ;
    },
});

export default authSlice.reducer;
