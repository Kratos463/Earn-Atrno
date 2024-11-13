import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";
import { addTaskRequest, addTaskResponse, DailyLoginRewardTask, fetchOfficalTasksResponse
    ,DailyLoginRewardTaskReponse,
    DailyTaskReponse,
    DailyTask,
    AddDailyTaskResponse,
    AddDailyTask

 } from "@/types/task";

 export const createdailyLoginRewardTask = createAsyncThunk<DailyLoginRewardTask, FormData>(
    'task/createdailyLoginRewardTask',
    async (taskData: FormData, { rejectWithValue }) => { 
        try {
            const response = await axios.post<{ reward: DailyLoginRewardTask }>(
                `${process.env.API_URL}/api/v1/daily-login-reward`,
                taskData,
                getConfig()
            );
            return response.data.reward;
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


export const fetchDailyLoginRewardTasks = createAsyncThunk<DailyLoginRewardTaskReponse>(
    "task/fetchDailyLoginRewardTasks",
    async(_, {rejectWithValue}) => {
      try{
        const response = await axios.get<DailyLoginRewardTaskReponse>(
            `${process.env.API_URL}/api/v1/daily-login-reward`,
            getConfig()
        ) 

        return response.data
      }catch (error: any) {
        if (error.response) {
            return rejectWithValue(error.response.data);
        } else if (error.request) {
            console.log("Error while fetching daily login Tasks", error)
            return rejectWithValue('Network error: No response received');
        } else {
            return rejectWithValue(error.message);
        }
    }
    } 
)

export const fetchDailyTasks = createAsyncThunk<DailyTaskReponse>(
    "task/fetchDailyTasks",
    async(_, {rejectWithValue}) => {
      try{
        const response = await axios.get<DailyTaskReponse>(
            `${process.env.API_URL}/api/v1/task/daily-task`,
            getConfig()
        ) 

        return response.data
      }catch (error: any) {
        if (error.response) {
            return rejectWithValue(error.response.data);
        } else if (error.request) {
            console.log("Error while fetching daily Tasks", error)
            return rejectWithValue('Network error: No response received');
        } else {
            return rejectWithValue(error.message);
        }
    }
    } 
)

export const createDailyTask = createAsyncThunk<AddDailyTaskResponse, FormData>(
    'task/createDailyTask',
    async (taskData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddDailyTaskResponse>(
                `${process.env.API_URL}/api/v1/task/daily-task`,
                taskData,
                getConfig()
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

export const createOfficialTask = createAsyncThunk<addTaskResponse, addTaskRequest>(
    'task/createOfficialTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await axios.post<addTaskResponse>(
                `${process.env.API_URL}/api/v1/task/official-tasks`,
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
            `${process.env.API_URL}/api/v1/task/official-tasks`,
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
    dailyLoginRewardTasks : [] as DailyLoginRewardTask[],
    dailyTasks : [] as DailyTask[]
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


            .addCase(createdailyLoginRewardTask.pending, (state)=> {
                state.fetchLoading= true,
                state.error = null
            })
            .addCase(createdailyLoginRewardTask.fulfilled, (state, action: PayloadAction<DailyLoginRewardTask>)=> {
                state.fetchLoading= true,
                state.dailyLoginRewardTasks.push(action.payload)
            })
            .addCase(createdailyLoginRewardTask.rejected, (state, action)=> {
                state.fetchLoading = false,
                state.error = action.payload as string
            })

            // fetch daily login rewards
            .addCase(fetchDailyLoginRewardTasks.pending, (state)=> {
                state.fetchLoading= true,
                state.error = null
            })
            .addCase(fetchDailyLoginRewardTasks.fulfilled, (state, action: PayloadAction<DailyLoginRewardTaskReponse>)=> {
                state.fetchLoading= true,
                state.dailyLoginRewardTasks= action.payload.dailyRewards
            })
            .addCase(fetchDailyLoginRewardTasks.rejected, (state, action)=> {
                state.fetchLoading = false,
                state.error = action.payload as string
            })


            .addCase(fetchDailyTasks.pending, (state)=> {
                state.fetchLoading= true,
                state.error = null
            })
            .addCase(fetchDailyTasks.fulfilled, (state, action: PayloadAction<DailyTaskReponse>)=> {
                state.fetchLoading= true,
                state.dailyTasks= action.payload.tasks
            })
            .addCase(fetchDailyTasks.rejected, (state, action)=> {
                state.fetchLoading = false,
                state.error = action.payload as string
            })


            .addCase(createDailyTask.pending, (state)=> {
                state.fetchLoading= true,
                state.error = null
            })
            .addCase(createDailyTask.fulfilled, (state, action: PayloadAction<AddDailyTaskResponse>)=> {
                state.fetchLoading= true,
                state.dailyTasks.push(action.payload.task)
            })
            .addCase(createDailyTask.rejected, (state, action)=> {
                state.fetchLoading = false,
                state.error = action.payload as string
            })
    }
})

export default taskSlice.reducer