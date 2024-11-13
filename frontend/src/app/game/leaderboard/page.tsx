"use client"

import LeaderboardList from '@/components/game/LeaderBoardList';
import DefaultLayout from '@/components/layout/DefaultLayout';
import React from 'react';


const LeaderBoard: React.FC = () => {
    return (
        <DefaultLayout>
            <LeaderboardList />
        </DefaultLayout>
    )
}



export default LeaderBoard;