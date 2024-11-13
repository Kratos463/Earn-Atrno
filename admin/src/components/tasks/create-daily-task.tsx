"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  createdailyLoginRewardTask,
  createDailyTask,
  fetchDailyTasks,
} from "@/Redux/Tasks";
import { DailyTask } from "@/types/task";
import SuccessPop from "@/components/SuccessPopup/SuccessPopup";

const CreateDailyTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addLoading } = useAppSelector((state) => state.task);
  const [showSuccessPop, setShowSuccessPop] = useState(false);

  const [formData, setFormData] = useState<DailyTask>({
    title: "",
    username: "",
    url: "",
    platform: "",
    reward: 0,
    description: "",
    expiryOn: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "reward" ? Number(value) : value,
    }));
  };

  const handleClose = () => {
    setShowSuccessPop(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("username", formData.username);
    formDataObj.append("url", formData.url);
    formDataObj.append("platform", formData.platform);
    formDataObj.append("reward", formData.reward.toString()); // converting number to string for FormData
    formDataObj.append("description", formData.description);
    formDataObj.append("expiryOn", formData.expiryOn);

    try {
      await dispatch(createDailyTask(formDataObj)).unwrap();
      setShowSuccessPop(true);
      setFormData({
        title: "",
        username: "",
        url: "",
        platform: "",
        reward: 0,
        description: "",
        expiryOn: "",
      });
      dispatch(fetchDailyTasks());
    } catch (error) {
      console.error("Failed to add official task:", error);
      // Display error to user (add your error handling here)
    }
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
            <SuccessPop
              title="Success! Daily Task Created!"
              onClose={handleClose}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  rows={4}
                />
              </div>

              <div className="mb-4.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    URL
                  </label>
                  <input
                    required
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="Enter URL"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Expiry Date
                  </label>
                  <input
                    required
                    type="date"
                    name="expiryOn"
                    value={formData.expiryOn}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Social Media Username
                  </label>
                  <input
                    required
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
                    Social Media Platform
                  </label>
                  <select
                    required
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select Platform</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Reward Points
                  </label>
                  <input
                    required
                    type="number"
                    name="reward"
                    value={formData.reward || ""}
                    onChange={handleChange}
                    placeholder="Enter reward"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addLoading}
                className="flex justify-center w-full rounded bg-primary px-5 py-3 font-medium text-gray"
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

export default CreateDailyTask;
