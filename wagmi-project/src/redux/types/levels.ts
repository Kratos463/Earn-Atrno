interface PowerUps {
    onTap: number;
    energy: number;
}

interface Achiever {
    referralCode: string;
}

export interface Level {
    _id: string;
    name: string;
    character: string;
    minimumPoints: number;
    maximumPoints: number;
    totalAchievers: number;
    levelNumber: number;
    powerUps: PowerUps;
    reward: number;
    paginatedAchievers: Achiever[];
    memberCount: number;
    currentMemberPosition: number;
}

export interface LevelRequest{
    currentMember: string,
    page: number,
    pageSize: number,
    lvl: any 
}
