import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";
import { Boost, Pagination, BoosterResponse } from "@/types/boosts";

// Initial state
const initialState = {
    isLoading: false,
    error: null as string | null,
    energyBoosts: [] as Boost[],
    pagination: {} as Pagination,
    tapBoosts: [] as Boost[],
};

// Create async thunk for fetching boosts
export const fetchBoosts = createAsyncThunk<
    BoosterResponse, // Return type
    { type: "energy" | "tap"; page: number; limit: number },
    { rejectValue: string } // Custom error type
>(
    "booster/fetchBoosts",
    async ({ type, page, limit }, { rejectWithValue }) => {
        try {
            const endpoint = type === "energy" ? "energy" : "multitap";
            const response = await axios.get<BoosterResponse>(
                `${process.env.API_URL}/api/v1/booster/${endpoint}?page=${page}&limit=${limit}`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching boosts:", error);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Failed to fetch boosts. Please try again.");
            }
            return rejectWithValue("Failed to fetch boosts. Please try again.");
        }
    }
);

// Create async thunk for creating boosts
export const createBoosts = createAsyncThunk<
    Boost,
    { type: "energy" | "tap"; formData: FormData },
    { rejectValue: string }
>(
    "booster/createBoosts",
    async ({ type, formData }, { rejectWithValue }) => {
        try {
            const endpoint = type === "energy" ? "energy" : "multitap";
            const response = await axios.post<{ boost: Boost }>( // Adjust response type to match Boost
                `${process.env.API_URL}/api/v1/booster/${endpoint}`,
                formData,
                getConfig()
            );

            return response.data.boost;
        } catch (error) {
            console.error("Error while creating boosts:", error);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Failed to create boosts. Please try again.");
            }
            return rejectWithValue("Failed to create boosts. Please try again.");
        }
    }
);

 
// Slice
const boostSlice = createSlice({
    name: "boost",
    initialState,
    reducers: {
        addBooster: (state, action: PayloadAction<{ type: "energy" | "tap"; booster: Boost }>) => {
            if (action.payload.type === "energy") {
                state.energyBoosts.push(action.payload.booster);
            } else {
                state.tapBoosts.push(action.payload.booster);
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch boosts
        builder
            .addCase(fetchBoosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBoosts.fulfilled, (state, action: PayloadAction<BoosterResponse>) => {
                state.isLoading = false;
                if (action.meta.arg.type === "energy") {
                    state.energyBoosts = action.payload.boosts;
                } else {
                    state.tapBoosts = action.payload.boosts;
                }
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchBoosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create boosts
        builder
            .addCase(createBoosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBoosts.fulfilled, (state, action: PayloadAction<Boost>) => {
                state.isLoading = false;
                if (action.meta.arg.type === "energy") {
                    state.energyBoosts.push(action.payload);
                } else {
                    state.tapBoosts.push(action.payload);
                }
            })
            .addCase(createBoosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});
export const { addBooster } = boostSlice.actions;

export default boostSlice.reducer;
