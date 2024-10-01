import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";
import { Pagination, Member, FetchUsersResponse} from '@/types/user'



interface UserState {
    isLoading: boolean;
    error: string | null;
    members: Member[];
    pagination: Pagination;
}


const initialState: UserState = {
    isLoading: false,
    error: null,
    members: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMembers: 1
    },
};




export const fetchUsers = createAsyncThunk<FetchUsersResponse, { page: number, limit: number }>(
    "users/fetchUsers",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get<FetchUsersResponse>(
                `${process.env.API_URL}/api/v1/admin/members?page=${page}&limit=${limit}`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching users:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to fetch users list. Please try again.");
            }
            return rejectWithValue("Failed to fetch users list. Please try again.");
        }
    }
);


const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<FetchUsersResponse>) => {
                state.isLoading = false;
                state.members = action.payload.members;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
          ;
    },
});

export default userSlice.reducer;
