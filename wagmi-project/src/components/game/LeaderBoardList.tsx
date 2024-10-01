import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchLevelLeaderBoard } from '@/redux/levelSlice';
import { fetchCurrentMember } from '@/redux/authSlice';
import { formatNumber } from '@/helper/convertNumber';

const LeaderboardList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { level, levelLoading } = useAppSelector((state) => state.level); // loading state from redux
    const { member } = useAppSelector((state) => state.auth);
    const [currentLevel, setCurrentLevel] = useState<number>(member?.currentLevelDetails?.levelNumber || 0);

    useEffect(() => {
        dispatch(fetchCurrentMember());
    }, [dispatch]);

    useEffect(() => {
        if (member?._id) {
            dispatch(fetchLevelLeaderBoard({ currentMember: member._id, page: 1, pageSize: 10, lvl: currentLevel }));
        }
    }, [dispatch, currentLevel, member]);

    const handlePreviousLevel = () => {
        setCurrentLevel((prev) => (prev > 0 ? prev - 1 : 12));
    };

    const handleNextLevel = () => {
        setCurrentLevel((prev) => (prev < 12 ? prev + 1 : 0));
    };

    return (
        <div className="pb-16 p-4 text-white mx-auto w-full max-w-[600px] h-screen">
            <div className="flex flex-col items-center mb-6">
            
                    <img
                        src='/assets/Images/character.png'
                        alt="character"
                        className="w-32 h-32 rounded-lg mb-4"
                    />
        
                <div className="flex items-center">
                    <button
                        onClick={handlePreviousLevel}
                        className="text-secondary mx-2 p-2 rounded-full transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
          
                        <span className="text-lg font-semibold">
                            {level?.name || 'Level Name'}
                        </span>
              
                    <button
                        onClick={handleNextLevel}
                        className="text-secondary mx-2 p-2 rounded-full transition"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className="text-gray-300 text-sm mb-2">
                 
                        {formatNumber(level?.minimumPoints || 0)} / ${formatNumber(level?.maximumPoints || 0)}
                
                </div>
            </div>

            {/* Leaderboard Table */}
            <div>
                {level?.paginatedAchievers && level.paginatedAchievers.length > 0 ? (
                    <ul>
                        {level.paginatedAchievers.map((user, index) => (
                            <li key={index} className="mb-4 flex items-center justify-between p-1 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition">
                                <div className="flex items-center">
                                    <img
                                        src='/assets/Images/men.jpg'
                                        alt='image'
                                        className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1"
                                    />
                                    <div className="flex-grow text-left">
                                        <h3 className="text-sm font-semibold">{user.referralCode}</h3>
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-gray-300 mr-2">{index + 1}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center">No achievers found for this level.</div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardList;
