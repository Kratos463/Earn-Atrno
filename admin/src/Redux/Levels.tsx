import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";
import { Level, Pagination, GetLevelsResponse, CreateLevelRequest, CreateLevelResponse } from "@/types/levels";


// Initial state
const initialState = {
    isLoading: false,
    error: null as string | null,
    levels: [] as Level[],
    pagination: {} as Pagination,
    addLoading: false
};
  
// Create async thunk for getting levels
export const fetchLevels = createAsyncThunk<GetLevelsResponse, { page: number, limit: number }>(
    "promotion/fetchLevels",
    async ({ page, limit },  { rejectWithValue }) => {
        try {
            const response = await axios.get<GetLevelsResponse>(
                `${process.env.API_URL}/api/v1/level?page=${page}&limit=${limit}`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching levels:", error);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Failed to fetch levels. Please try again.");
            }
            return rejectWithValue("Failed to fetch levels. Please try again.");
        }
    }
);

export const createLevel = createAsyncThunk<CreateLevelResponse, CreateLevelRequest>(
    'task/createLevel',
    async (levelData, { rejectWithValue }) => {
        try {
            const response = await axios.post<CreateLevelResponse>(
                `${process.env.API_URL}/api/v1/level`,
                levelData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': process.env.API_KEY as string,
                        'access-token': process.env.ACCESS_TOKEN as string,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while creating level:", error);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Failed to create level. Please try again.");
            }
            return rejectWithValue("Failed to create level. Please try again.");
        }
    }
);


// Slice
const levelSlice = createSlice({
    name: "level",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLevels.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLevels.fulfilled, (state, action: PayloadAction<GetLevelsResponse>) => {
                state.isLoading = false;
                state.levels = action.payload.levels;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchLevels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createLevel.pending, (state) => {
                state.addLoading = true;
                state.error = null;
            })
            .addCase(createLevel.fulfilled, (state, action: PayloadAction<CreateLevelResponse>) => {
                state.addLoading = false;
            })
            .addCase(createLevel.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.payload as string;
            })
    },
});

export default levelSlice.reducer;
