export interface OfficialTask{
    _id: string,
    title: string,
    url: string,
    username: string,
    socialMediaType: string,
    icon: string,
    reward: number,
    createdAt: string,
    updatedAt: string
}

export interface FetchOfficialTaskResponse{
    message: string,
    success: boolean,
    officialTasks: OfficialTask[]
}