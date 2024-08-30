import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import TapOnCoinCounter from '@/components/game/TapOnCoin';

const Home: React.FC = () => {

    return (
        <DefaultLayout>
            <TapOnCoinCounter />
        </DefaultLayout>
    );
};

export default Home;