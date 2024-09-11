import ClaimDailyReward from '@/components/game/dailyLogin';
import DefaultLayout from '@/components/layout/DefaultLayout';
import React from 'react';


const DailyLoginReward: React.FC = () => {
  return (
    <DefaultLayout>
      <ClaimDailyReward />
    </DefaultLayout>
  )
}



export default DailyLoginReward;