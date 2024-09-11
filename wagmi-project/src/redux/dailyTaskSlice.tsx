import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from '../helper/configHeader';
import { ClaimDailyRewardResponse, DailyLogin } from './types/dailyTask';

export const fetchAllDailyLoginReward = createAsyncThunk<
    DailyLogin[], // The return type is an array of DailyLogin
    void,
    { rejectValue: string }
>(
    "dailyTask/fetchAllDailyLoginReward",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<{ message?: string; success?: boolean; dailyRewards: DailyLogin[] }>(
                '/api/v1/daily-login/get-all-daily-login-reward',
                configHeader()
            );
            return response.data.dailyRewards;
        } catch (error) {
            console.log("Error while fetching daily login rewards", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "An error occurred");
            }
            return rejectWithValue("Error while fetching daily login rewards. Please try again.");
        }
    }
);

export const claimTodayLoginReward = createAsyncThunk<
ClaimDailyRewardResponse,
void,
{ rejectValue: string }
>(
    "dailyTask/claimTodayLoginReward",
    async (_, { rejectWithValue }) => {
        try {

            const response = await axios.post<ClaimDailyRewardResponse>(
                "/api/v1/member/claim-current-day-login-reward",
                {},
                configHeader() 
            );

            return response.data;
        } catch (error) {
            console.log("Error while claiming today's login reward", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "An error occurred");
            }
            return rejectWithValue("Error while claiming today's login reward. Please try again.");
        }
    }
);


interface DailyTaskState {
    dailyLoginLoading: boolean;
    error: string | null;
    dailyLoginRewards: DailyLogin[];
}

const initialState: DailyTaskState = {
    dailyLoginLoading: false,
    error: null,
    dailyLoginRewards: []
};

const dailyTaskSlice = createSlice({
    name: "dailyTask",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDailyLoginReward.pending, (state) => {
                state.dailyLoginLoading = true;
                state.error = null;
            })
            .addCase(fetchAllDailyLoginReward.fulfilled, (state, action: PayloadAction<DailyLogin[]>) => {
                state.dailyLoginLoading = false;
                state.dailyLoginRewards = action.payload;
                state.error = null;
            })
            .addCase(fetchAllDailyLoginReward.rejected, (state, action) => {
                state.dailyLoginLoading = false;
                state.error = action.payload || "An unknown error occurred";
            });
    }
});

export default dailyTaskSlice.reducer;
