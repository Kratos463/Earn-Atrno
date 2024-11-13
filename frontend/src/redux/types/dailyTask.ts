
export interface DailyLogin{
    _id: string,
    day: number,
    rewardValue: number,
    isActive: true
}

export interface ClaimDailyRewardResponse{
    message: string,
    success: boolean
}