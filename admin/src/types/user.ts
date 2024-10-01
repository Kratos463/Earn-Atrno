export interface Member {
    _id: string;
    userId: string;
    createdAt: string,
    wallet: {
        coins: number;
    },
    referralCode: string,
    referredBy: string,
    country: string,
    accountStatus: string,
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalMembers: number;
}


 export interface FetchUsersResponse {
    status: boolean;
    message: string;
    members: Member[];
    pagination: Pagination;
}