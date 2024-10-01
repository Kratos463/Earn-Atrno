import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from '../helper/configHeader';
import { Level, LevelRequest } from './types/levels';
import { Booster, EnergyBoosterResponse } from './types/booster';


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


export const fetchEnergyBooster = createAsyncThunk<
EnergyBoosterResponse,
void,
{ rejectValue: string }
>(
    'level/fetchEnergyBooster',
    async(_, {rejectWithValue}) => {
        try{
            const response = await axios.get<EnergyBoosterResponse>(
                "/api/v1/booster/single-energy-booster",
                configHeader() 
            );

            return response.data;
        }catch(error: any){
            console.log("Error while fetch energy booster", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "An error occurred");
            }
            return rejectWithValue("Failed to fetch energy booster. Please try again.");
        }
    }
);

export const fetchTapBooster = createAsyncThunk<
EnergyBoosterResponse,
void,
{ rejectValue: string }
>(
    'level/fetchTapBooster',
    async(_, {rejectWithValue}) => {
        try{
            const response = await axios.get<EnergyBoosterResponse>(
                "/api/v1/booster/single-tap-booster",
                configHeader() 
            );

            return response.data;
        }catch(error: any){
            console.log("Error while fetch energy booster", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "An error occurred");
            }
            return rejectWithValue("Failed to fetch energy booster. Please try again.");
        }
    }
);

interface LevelState {
    levelLoading: boolean;
    error: string | null;
    level: Level | null,
    energyBooster : Booster | null
    energyLoading: boolean,
    tapBooster: Booster| null
}

const initialState: LevelState = {
    levelLoading: false,
    error: null,
    level: {} as Level,
    energyBooster : {} as Booster,
    energyLoading: false,
    tapBooster: {} as Booster
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
            .addCase(fetchEnergyBooster.pending, (state)=> {
                state.energyLoading = true,
                state.error = null
            })
            .addCase(fetchEnergyBooster.fulfilled, (state, action : PayloadAction<EnergyBoosterResponse>)=> {
                state.error = null,
                state.energyLoading= false,
                state.energyBooster = action.payload.level
            })
            .addCase(fetchEnergyBooster.rejected, (state, action)=> {
                state.error = action.payload || "An unknown error occurred";
                state.energyLoading = false
            })
            .addCase(fetchTapBooster.pending, (state)=> {
                state.energyLoading = true,
                state.error = null
            })
            .addCase(fetchTapBooster.fulfilled, (state, action : PayloadAction<EnergyBoosterResponse>)=> {
                state.error = null,
                state.energyLoading= false,
                state.tapBooster = action.payload.level
            })
            .addCase(fetchTapBooster.rejected, (state, action)=> {
                state.error = action.payload || "An unknown error occurred";
                state.energyLoading = false
            })
    }
})

export default levelSlice.reducer