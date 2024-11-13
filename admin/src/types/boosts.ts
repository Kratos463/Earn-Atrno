export interface Boost{
    level: number,
    cost:  number,
    energy? : number,
    tap? : number,
    _id?: string
}

export interface Pagination {
    currentPage:number,
    totalPages: number,
    totalBoosts: number
}

export interface BoosterResponse{
    message: string,
    success: boolean,
    boosts: Boost[],
    pagination: Pagination
}