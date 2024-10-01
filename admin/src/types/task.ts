
export interface addTaskRequest{
    _id? : string
    title: string,
    url: string,
    username: string,
    socialMediaType: string,
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