"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { createOfficialTask, fetchOfficialTasks } from '@/Redux/Tasks';
import {addTaskRequest} from '@/types/task'
import SuccessPop from '@/components/SuccessPopup/SuccessPopup'

const CreateOfficialTask: React.FC = () => {
    const dispatch = useAppDispatch();
    const { addLoading } = useAppSelector((state) => state.task);
    const [showSuccessPop, setShowSuccessPop] = useState(false);

 
    const [formData, setFormData] = useState<addTaskRequest>({
        title: "",
        username: "",
        url: "",
        socialMediaType: "",
        icon: new File([], ''),
        reward: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                icon: file,
            }));
        }
    };


    const handleClose = () => {
        setShowSuccessPop(false);
    };

    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createOfficialTask(formData))
            .unwrap()
            .then(()=> {
                setShowSuccessPop(true);
                setFormData({
                    title: "",
                    username: "",
                    url: "",
                    socialMediaType: "",
                    icon: null,
                    reward: 0,
                })
                dispatch(fetchOfficialTasks())
            })
            .catch(error => {
                console.error('Failed to add official task:', error);
            });
    };

    return (

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="col-span-5">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Create Official Task
                            </h3>
                        </div>

                        {showSuccessPop && (
                            <SuccessPop title="Success! Official Task Created!" onClose={handleClose} />
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter title"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            URL
                                        </label>
                                        <input
                                            type="text"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleChange}
                                            placeholder="Enter URL"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Icon or Image
                                        </label>
                                        <input
                                            type="file"
                                            name="icon"
                                            onChange={handleFileChange}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Social Media Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Enter username"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Social Media Type (in small letters)
                                        </label>
                                        <input
                                            type="text"
                                            name="socialMediaType"
                                            value={formData.socialMediaType}
                                            onChange={handleChange}
                                            placeholder="e.g., twitter"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Reward Amount
                                        </label>
                                        <input
                                            type="number"
                                            name="reward"
                                            value={formData.reward}
                                            onChange={handleChange}
                                            placeholder="Enter reward amount"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    {addLoading ? "Processing..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

    );
};

export default CreateOfficialTask;
