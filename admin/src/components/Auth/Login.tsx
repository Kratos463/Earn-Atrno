import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { login } from "@/Redux/Auth"; // Adjust path as per your project structure
import { useRouter } from "next/navigation";

const LoginIn: React.FC = () => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { isLoading, token } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            await dispatch(login({ username, password })).unwrap();
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full sm:w-96 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8">
                <div className="border-b border-stroke pb-4 mb-6 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white text-lg">
                        Sign In
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-black dark:text-white mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-black dark:text-white mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-opacity-90 transition"
                    >
                        {isLoading ? "Processing..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginIn;
