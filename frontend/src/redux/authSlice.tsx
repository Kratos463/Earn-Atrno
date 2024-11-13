import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from "../helper/configHeader";
import { FriendListItem, FriendListResponse, Member, MemberResponse } from "./types/member";

interface TapCoinRequest {
  incrementPoint: number;
  telegramId: string;
}

interface TapCoinResponse {
  newCoinCount: number;
  success: boolean;
}

// Define the asyncThunk for tapCoin
export const tapCoin = createAsyncThunk<
  TapCoinResponse,
  TapCoinRequest,
  { rejectValue: string }
>(
  "member/tapCoin",
  async ({ incrementPoint, telegramId }, { rejectWithValue }) => {
    try {
      const response = await axios.post<TapCoinResponse>(
        `/api/v1/member/coins/tap?telegramId=${telegramId}`,
        { incrementPoint },
        configHeader()
      );
      return response.data;
    } catch (error: any) {
      console.error("Error while updating the coins", error);
      if (error.response && error.response.data) {
        // Return detailed error message
        return rejectWithValue(
          error.response.data.message || "Failed to tap coin"
        );
      }
      return rejectWithValue("Failed to tap coin. Please try again.");
    }
  }
);

export const fetchFriendList = createAsyncThunk<
  FriendListResponse,
  string,
  { rejectValue: string }
>("auth/fetchFriendList", async (telegramId, { rejectWithValue }) => {
  try {
    const response = await axios.get<FriendListResponse>(
      `/api/v1/member/friends?telegramId=${telegramId}`,
      configHeader()
    );

    return response.data;
  } catch (error) {
    console.error("Error while fetching current member friends", error);
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch current member friends"
      );
    }
    return rejectWithValue("Failed to fetch current member. Please try again");
  }
});

// for fetch current member details
export const fetchCurrentMember = createAsyncThunk<
  Member,
  string,
  { rejectValue: string }
>("auth/fetchCurrentMember", async (telegramId, { rejectWithValue }) => {
  try {
    const response = await axios.get<MemberResponse>(
      `/api/v1/member/current?telegramId=${telegramId}`,
      configHeader()
    );

    if (response.data.member.length > 0) {
      return response.data.member[0];
    } else {
      return rejectWithValue("No member data found");
    }
  } catch (error) {
    console.error("Error while fetching current member", error);
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch current member"
      );
    }
    return rejectWithValue("Failed to fetch current member. Please try again");
  }
});

interface AuthState {
  error: string | null;
  friendList: FriendListItem[] | [];
  friendListLoading: boolean;
  currentMemberLoading: boolean;
  member: Member;
  tapCoinLoading: boolean;
}

const initialState: AuthState = {
  error: null,
  friendList: [],
  friendListLoading: false,
  currentMemberLoading: false,
  member: {} as Member,
  tapCoinLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.friendList = [];
      state.member = {} as Member;
      state.friendListLoading = false;
      state.currentMemberLoading = false;
      state.tapCoinLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendList.pending, (state) => {
        state.friendListLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFriendList.fulfilled,
        (state, action: PayloadAction<FriendListResponse>) => {
          state.friendListLoading = false;
          state.friendList = action.payload.friendList;
          state.error = null;
        }
      )
      .addCase(fetchFriendList.rejected, (state, action) => {
        state.friendListLoading = false;
        state.error = action.payload || "An unknown error occurred";
      })

      .addCase(fetchCurrentMember.pending, (state) => {
        (state.currentMemberLoading = true), (state.error = null);
      })
      .addCase(
        fetchCurrentMember.fulfilled,
        (state, action: PayloadAction<Member>) => {
          (state.currentMemberLoading = false), (state.error = null);
          state.member = action.payload;
        }
      )
      .addCase(fetchCurrentMember.rejected, (state, action) => {
        (state.currentMemberLoading = false),
          (state.error = action.payload || "An unknown error occurred");
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
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
