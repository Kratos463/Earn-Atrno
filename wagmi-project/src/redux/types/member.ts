
export interface MemberResponse {
  message?: string;
  success?: boolean;
  member: Member[];
};


export interface Member {
    _id: string;
    userId: string;
    referralCode: string;
    dailyLoginStreak: number;
    lastLoginDate: string;
    currentDayRewardClaimed: boolean;
    nextDayRewardDate: string;
    wallet: Wallet;
    powerUps: PowerUps;
    accountStatus: string;
    dailyTaskProgress: any[];
    levelDetails: LevelDetails;
    energyLevelDetails: EnergyLevelDetails;
    tapLevelDetails: TapLevelDetails;
    curretLevelDetails: CurrentLevel
  }
  
  export interface Wallet {
    coins: number;
  }
  
  export interface PowerUps {
    onTap: number;
    energy: number;
    tapEnergy: number;
  }
  
  export interface LevelDetails {
    _id: string;
    name: string;
    character: string;
    minimumPoints: number;
    maximumPoints: number;
    achievers: any[];
    totalAchievers: number;
    levelNumber: number;
    powerUps: PowerUpsDetails;
    reward: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  export interface CurrentLevel{
    _id: string,
    levelNumber: number
  }
  
  export interface PowerUpsDetails {
    onTap: number;
    energy: number;
  }
  
  export interface EnergyLevelDetails {
    _id: string;
    level: number;
    cost: number;
    energy: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface TapLevelDetails {
    _id: string;
    level: number;
    cost: number;
    tap: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface MemberList {
    member: Member[];
  }
  