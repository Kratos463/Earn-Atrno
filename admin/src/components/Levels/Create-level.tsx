"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { CreateLevelRequest } from '@/types/levels'
import { createLevel, fetchLevels } from '@/Redux/Levels'
import SuccessPop from '@/components/SuccessPopup/SuccessPopup'

const CreateLevels: React.FC = () => {
    const dispatch = useAppDispatch();
    const { addLoading, error } = useAppSelector((state) => state.level);
    const [showSuccessPop, setShowSuccessPop] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 20;


    const [formData, setFormData] = useState<CreateLevelRequest>({
        name: "",
        character: new File([], ''),
        minimumPoints: 0,
        maximumPoints: 0,
        levelNumber: 0,
        onTap: 0,
        energy: 0,
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
                character: file,
            }));
        }
    };


    const handleClose = () => {
        setShowSuccessPop(false);
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createLevel(formData))
            .unwrap()
            .then(() => {
                setShowSuccessPop(true);
                setFormData({
                    name: "",
                    character: new File([], ''),
                    minimumPoints: 0,
                    maximumPoints: 0,
                    levelNumber: 0,
                    onTap: 0,
                    energy: 0,
                    reward: 0,
                })
                dispatch(fetchLevels({ page, limit }))
            })
            .catch(error => {
                console.error('Failed to add level:', error);
            });
    };

    return (

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="col-span-5">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Create Level
                        </h3>
                    </div>

                    {showSuccessPop && (
                        <SuccessPop title="Success! New Level Created!" onClose={handleClose} />
                    )}

                    {<p>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter name"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Reward On Level Up
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

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Character Image
                                    </label>
                                    <input
                                        type="file"
                                        name="character"
                                        onChange={handleFileChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Level Number
                                    </label>
                                    <input
                                        type="number"
                                        name="levelNumber"
                                        value={formData.levelNumber}
                                        onChange={handleChange}
                                        placeholder="Enter level number"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                             
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Minimum Ponits
                                    </label>
                                    <input
                                        type="number"
                                        name="minimumPoints"
                                        value={formData.minimumPoints}
                                        onChange={handleChange}
                                        placeholder="Enter minimum points"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Maximum Points
                                    </label>
                                    <input
                                        type="text"
                                        name="maximumPoints"
                                        value={formData.maximumPoints}
                                        onChange={handleChange}
                                        placeholder="Enter maximum points"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        OnTap Points
                                    </label>
                                    <input
                                        type="number"
                                        name="onTap"
                                        value={formData.onTap}
                                        onChange={handleChange}
                                        placeholder="Enter OnTap Points"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Energy  Increase By
                                    </label>
                                    <input
                                        type="number"
                                        name="energy"
                                        value={formData.energy}
                                        onChange={handleChange}
                                        placeholder="Enter energy"
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

export default CreateLevels;
