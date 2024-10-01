import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { configHeader } from '../helper/configHeader';
import {FetchOfficialTaskResponse, OfficialTask} from './types/officialTask'

export const fetchOfficialTasks = createAsyncThunk<FetchOfficialTaskResponse>(
    "officialtask/fetchOfficialTasks",
    async(_, {rejectWithValue}) => {
      try{
        const response = await axios.get<FetchOfficialTaskResponse>(
            `/api/v1/task/get-official-tasks`,
            configHeader()
        )

        return response.data
      }catch (error: any) {
        if (error.response) {
            return rejectWithValue(error.response.data);
        } else if (error.request) {
            console.log("Error while fetching officil Tasks", error)
            return rejectWithValue('Network error: No response received');
        } else {
            return rejectWithValue(error.message);
        }
    }
    } 
)

const initialState = {
    error: null as string | null,
    fetchLoading: false,
    officialTasks: [] as OfficialTask[],
}

const officialTaskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {},
    extraReducers: (builder)=> {
        builder
            .addCase(fetchOfficialTasks.pending, (state)=> {
                state.fetchLoading= true,
                state.error = null
            })
            .addCase(fetchOfficialTasks.fulfilled, (state, action: PayloadAction<FetchOfficialTaskResponse>)=> {
                state.fetchLoading= true,
                state.officialTasks= action.payload.officialTasks
            })
            .addCase(fetchOfficialTasks.rejected, (state, action)=> {
                state.fetchLoading = false,
                state.error = action.payload as string
            })
    }
})

export default officialTaskSlice.reducer