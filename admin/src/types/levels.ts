export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalLevels: number;
}

export interface PowerUps {
    onTap: number;
    energy: number;
}

export interface Level {
    _id: string;
    name: string;
    character: string;
    minimumPoints: number;
    maximumPoints: number;
    achievers: string[];
    totalAchievers: number;
    levelNumber: number;
    powerUps: PowerUps;
    reward: number;
    createdAt: string;  
    updatedAt: string; 
}

export interface GetLevelsResponse {
    success: boolean;
    message: string;
    levels: Level[];
    pagination: Pagination;
}


export interface CreateLevelRequest {
    name: string;
    character: File | null;
    minimumPoints: number;
    maximumPoints: number;
    levelNumber: number;
    onTap: number;  
    energy: number;
    reward: number;
}

export interface CreateLevelResponse{
    message: string,
    sucess: boolean
}