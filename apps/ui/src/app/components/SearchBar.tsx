import { useRef, useState } from 'react';

import { TextField } from '@mui/material';

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [inputValue, setInputValue] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        const newValue = event.target.value;
        setInputValue(newValue);

        if (newValue.length >= 3 || newValue.length === 0) {
            timeoutRef.current = setTimeout(() => onSearch(newValue), 200);
        }
    };

    return (
        <TextField
            label="Search"
            variant="outlined"
            sx={{ width: '100%' }}
            value={inputValue}
            onChange={handleInput}
            autoComplete="off"
        />
    );
}
