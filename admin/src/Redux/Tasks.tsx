import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";
import { addTaskRequest, addTaskResponse, fetchOfficalTasksResponse } from "@/types/task";

export const createOfficialTask = createAsyncThunk<addTaskResponse, addTaskRequest>(
    'task/createOfficialTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await axios.post<addTaskResponse>(
                `${process.env.API_URL}/api/v1/task/add-official-task`,
                taskData,
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
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue('Network error: No response received');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchOfficialTasks = createAsyncThunk<fetchOfficalTasksResponse>(
    "task/fetchOfficialTasks",
    async(_, {rejectWithValue}) => {
      try{
        const response = await axios.get<fetchOfficalTasksResponse>(
            `${process.env.API_URL}/api/v1/task/get-official-tasks`,
            getConfig()
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
    addLoading: false,
    error: null as string | null,
    fetchLoading: false,
    officialTasks: [] as addTaskRequest[],
}

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {},
    extraReducers: (builder)=> {
        builder
            .addCase(createOfficialTask.pending, (state) => {
                state.addLoading = true,
                state.error = null
            })
            .addCase(createOfficialTask.fulfilled, (state, action: PayloadAction<addTaskResponse>)=> {
                state.addLoading = false,
                state.error = null
            })
            .addCase(createOfficialTask.rejected, (state, action)=> {
                state.addLoading = false,
                state.error = action.payload as string
            })
            .addCase(fetchOfficialTasks.pending, (state)=> {
                state.fetchLoading= true,
                state.error = null
            })
            .addCase(fetchOfficialTasks.fulfilled, (state, action: PayloadAction<fetchOfficalTasksResponse>)=> {
                state.fetchLoading= true,
                state.officialTasks= action.payload.officialTasks
            })
            .addCase(fetchOfficialTasks.rejected, (state, action)=> {
                state.fetchLoading = false,
                state.error = action.payload as string
            })
    }
})

export default taskSlice.reducer