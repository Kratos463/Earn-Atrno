import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const tasks = [
    {
        id: 1,
        name: 'Complete Profile',
        image: '/assets/Images/youtube.png',
        amount: 10,
        link: '/tasks/profile',
    },
    {
        id: 2,
        name: 'Watch Tutorial Video',
        image: '/assets/Images/youtube.png',
        amount: 5,
        link: '/tasks/tutorial',
    },
    {
        id: 3,
        name: 'Invite Friends',
        image: '/assets/Images/youtube.png',
        amount: 15,
        link: '/tasks/invite',
    },
    // Add more tasks here
];

const TaskList: React.FC = () => {
    return (
        <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
            <img src="/assets/Images/dollar.png" alt="Bitcoin" className="mx-auto mb-4 w-20 h-20 shadow-2xl" />

            <h1 className="text-2xl font-bold text-center mb-2">
                More Tasks, More Rewards
            </h1>

            {/* Description */}
            <p className="text-center text-gray-300 mb-6 text-xs">
                Boost your productivity! Track tasks, hit your goals, and stay organized with ease. Every task completed brings you closer to success!
            </p>


            <div className="mb-6 flex-1">
                <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">Daily Tasks</h2>
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className="mb-4">
                            <Link
                                href={task.link}
                                className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={task.image}
                                        alt={task.name}
                                        className="w-10 h-10 object-cover rounded-full mr-4"
                                    />
                                    <div>
                                        <h3 className="text-sm">{task.name}</h3>
                                        <div className="flex items-center text-xs text-yellow-300 font-bold">
                                            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                            {task.amount}
                                        </div>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">Daily Login Reward</h2>
                <ul>
                    <li className="mb-4">
                        <Link
                            href="/tasks/official"
                            className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition"
                        >
                            <div className="flex items-center">
                                <img
                                    src="/assets/Images/youtube.png"
                                    alt="Official Task"
                                    className="w-10 h-10 object-cover rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="text-sm">Attend Meeting</h3>
                                    <div className="flex items-center text-xs text-yellow-300 font-bold">
                                        <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                        20
                                    </div>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </li>
                    {/* Add more official tasks here */}
                </ul>
            </div>

            <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">Official Tasks</h2>
                <ul>
                    <li className="mb-4">
                        <Link
                            href="/tasks/official"
                            className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition"
                        >
                            <div className="flex items-center">
                                <img
                                    src="/assets/Images/youtube.png"
                                    alt="Official Task"
                                    className="w-10 h-10 object-cover rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="text-sm ">Attend Meeting</h3>
                                    <div className="flex items-center text-xs text-yellow-300 font-bold">
                                        <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                        20
                                    </div>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </li>
                    {/* Add more official tasks here */}
                </ul>
            </div>

        </div>
    );
};

export default TaskList;
