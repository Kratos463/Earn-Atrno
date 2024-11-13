export interface OfficialTask{
    _id: string,
    title: string,
    url: string,
    username: string,
    platform: string,
    icon: string,
    reward: number,
    createdAt: string,
    updatedAt: string
}

export interface DailyTask{
    _id: string,
    title: string,
    url: string,
    username: string,
    platform: string,
    reward: number,
    createdAt: string,
    description: string,
    expiryOn: string
}

export interface FetchOfficialTaskResponse{
    message: string,
    success: boolean,
    officialTasks: OfficialTask[]
}

export interface FetchDailyTaskResponse{
    message: string,
    success: boolean,
    tasks: DailyTask[]
}