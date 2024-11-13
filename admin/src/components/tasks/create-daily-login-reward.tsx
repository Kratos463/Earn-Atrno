"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  createdailyLoginRewardTask,
  fetchDailyLoginRewardTasks,
} from "@/Redux/Tasks";
import { DailyLoginRewardTask } from "@/types/task";
import SuccessPop from "@/components/SuccessPopup/SuccessPopup";

const CreateDailyLoginReward: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addLoading } = useAppSelector((state) => state.task);
  const [showSuccessPop, setShowSuccessPop] = useState(false);

  const [formData, setFormData] = useState<DailyLoginRewardTask>({
    day: 0,
    rewardValue: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowSuccessPop(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("day", String(formData.day))
    submissionData.append("rewardValue", String(formData.rewardValue))

    dispatch(createdailyLoginRewardTask(submissionData))
      .unwrap()
      .then(() => {
        setShowSuccessPop(true);
        setFormData({
          day: 0,
          rewardValue: 0,
        });
        dispatch(fetchDailyLoginRewardTasks());
      })
      .catch((error) => {
        console.error("Failed to add official task:", error);
      });
  };

  return (
    <div className="w-50 flex-1 sm:w-100">
      <div className="col-span-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Daily Login Reward Task
            </h3>
          </div>

          {showSuccessPop && (
            <SuccessPop
              title="Success! Login Task Created!"
              onClose={handleClose}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Day
                </label>
                <input
                  required
                  type="number"
                  name="day"
                  value={formData.day || ""}
                  onChange={handleChange}
                  placeholder="ex - 1"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Reward
                </label>
                <input
                  required
                  type="number"
                  name="rewardValue"
                  value={formData.rewardValue || ""}
                  onChange={handleChange}
                  placeholder="ex - 5000"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDailyLoginReward;
