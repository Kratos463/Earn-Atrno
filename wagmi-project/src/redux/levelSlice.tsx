import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from '../helper/configHeader';
import { Level, LevelRequest } from './types/levels';


export const fetchLevelLeaderBoard = createAsyncThunk<
    Level,
    LevelRequest,
    { rejectValue: string }
>(
    'level/fetchLevelLeaderBoard',
    async (levelRequest, { rejectWithValue }) => {
        try {
            const response = await axios.get<{message?: string, success?:boolean, level: Level}>(`/api/v1/level/get-single-level`, {
                params: {
                    lvl: levelRequest.lvl,
                    page: levelRequest.page,
                    pageSize: levelRequest.pageSize,
                    currentMember: levelRequest.currentMember,
                }, ...configHeader(),
            });

            return response.data.level;
        } catch (error: any) {
            console.log("Error while fetch level leaderboard", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "An error occurred");
            }
            return rejectWithValue("Failed to fetch level leaderboard. Please try again.");
        }
    }
);

interface LevelState {
    levelLoading: boolean;
    error: string | null;
    level: Level | null
}

const initialState: LevelState = {
    levelLoading: false,
    error: null,
    level: {} as Level
}


const levelSlice = createSlice({
    name: "level",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLevelLeaderBoard.pending, (state)=> {
                state.levelLoading = true,
                state.error = null
            })
            .addCase(fetchLevelLeaderBoard.fulfilled, (state, action : PayloadAction<Level>)=> {
                state.error = null,
                state.levelLoading= false,
                state.level = action.payload
            })
            .addCase(fetchLevelLeaderBoard.rejected, (state, action)=> {
                state.error = action.payload || "An unknown error occurred";
                state.levelLoading = false
            })
    }
})

export default levelSlice.reducer