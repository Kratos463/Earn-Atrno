"use client"

import { useState, useEffect } from 'react';

const useLocalStorage = (key: string): string | null => {
    const [storedValue, setStoredValue] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const value = localStorage.getItem(key);
            setStoredValue(value);
        }
    }, [key]);

    return storedValue;
};

export default useLocalStorage;
