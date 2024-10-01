import React, { useEffect } from 'react';

interface SuccessPopProps {
    title: string;
    onClose: () => void;
}

const SuccessPop: React.FC<SuccessPopProps> = ({ title, onClose }) => {
    useEffect(() => {
        // Auto-close the pop-up after 3 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // Clear the timer if the component is unmounted
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-80">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    aria-label="Close"
                >
                    &times;
                </button>
                <div className="flex items-center justify-center mb-4">
                    <svg
                        className="h-12 w-12 text-green"
                        fill="green"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.293-10.293a1 1 0 00-1.414 0L10 11.586 7.121 8.707a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-center">{title}</h2>
            </div>
        </div>
    );
};

export default SuccessPop;
