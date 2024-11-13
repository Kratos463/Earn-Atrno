"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import SuccessPop from "@/components/SuccessPopup/SuccessPopup";
import { Boost } from "@/types/boosts";
import { addBooster, createBoosts } from "@/Redux/Booster";

const CreateTapBooster: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.booster);
  const [showSuccessPop, setShowSuccessPop] = useState(false);

  const [formData, setFormData] = useState<Boost>({
    level: 0,
    cost: 0,
    tap: 0,
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

    // Initialize formData here if not already done elsewhere
    const submissionData = new FormData();
    submissionData.append("level", String(formData.level));
    submissionData.append("cost", String(formData.cost));
    submissionData.append("tap", String(formData.tap));

    dispatch(createBoosts({ type: "tap", formData: submissionData }))
      .unwrap() // Unwrap the action to handle promise rejections
      .then((newBooster: Boost) => {
        // Success
        dispatch(addBooster({ type: "tap", booster: newBooster })); // Pass type and booster
        setShowSuccessPop(true);
        setFormData({
          level: 0,
          cost: 0,
          tap: 0,
        });
      })
      .catch((error) => {
        console.error("Failed to add boost:", error);
      });
  };


  return (
    <div className="w-50 sm:w-100 h-fit flex-1">
      <div className="col-span-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create OnTap Booster
            </h3>
          </div>

          {showSuccessPop && (
            <SuccessPop
              title="Success! New Level Created!"
              onClose={handleClose}
            />
          )}

          {<p className="px-7 text-red">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Level Number
                </label>
                <input
                  required
                  type="number"
                  name="level"
                  value={formData.level || ""}
                  onChange={handleChange}
                  placeholder="ex - 1"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Purchase Cost
                </label>
                <input
                  required
                  type="number"
                  name="cost"
                  value={formData.cost || ""}
                  onChange={handleChange}
                  placeholder="ex - 5000"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Energy Boost By (Points)
                </label>
                <input
                  required
                  type="number"
                  name="tap"
                  value={formData.tap || ""}
                  onChange={handleChange}
                  placeholder="ex - 1"
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

export default CreateTapBooster;
