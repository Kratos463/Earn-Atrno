
export interface addTaskRequest{
    _id? : string
    title: string,
    url: string,
    username: string,
    platform: string,
    icon: File | null;
    reward: number
}

export interface addTaskResponse{
    message: string,
    success: boolean
}

export interface fetchOfficalTasksResponse{
    message: string,
    success: boolean
    officialTasks: addTaskRequest[]
}

export interface DailyLoginRewardTask{
    _id?: string,
    day: number,
    rewardValue: number,
    isActive?: boolean
}

export interface DailyLoginRewardTaskReponse{
    message: string,
    success: boolean,
    dailyRewards: DailyLoginRewardTask[]
}

export interface DailyTask{
    _id? : string
    title: string,
    url: string,
    username: string,
    platform: string,
    reward: number,
    description: string,
    expiryOn: string
}

export interface DailyTaskReponse{
    message: string,
    success: boolean,
    tasks: DailyTask[]
}

export interface AddDailyTask{
    title: string,
    url: string,
    username: string,
    platform: string,
    expiryOn: string
    reward: number,
    description: string
}

export interface AddDailyTaskResponse{
    message: string,
    success: boolean,
    task: DailyTask
}