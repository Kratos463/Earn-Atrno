export interface Booster{
    _id: string,
    level: number,
    cost: number,
    energy?: number,
    tap?: number
}

export interface EnergyBoosterResponse{
    success: boolean,
    message: string,
    level: Booster
}