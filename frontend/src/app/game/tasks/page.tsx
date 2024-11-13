import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import TaskList from '@/components/game/TaskList';

const Tasks: React.FC = () => {

    return (
        <DefaultLayout>
            <TaskList />
        </DefaultLayout>
    );
};

export default Tasks;