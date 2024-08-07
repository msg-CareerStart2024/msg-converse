import { TextField } from '@mui/material';
import { useRef, useState } from 'react';

export default function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const search = (query: string) => {
        console.log(query);
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const newValue = event.target.value;
        setInputValue(newValue);

        timeoutRef.current = setTimeout(() => search(newValue), 1000);
    };

    return (
        <TextField
            label="Search"
            variant="outlined"
            sx={{ width: '100%' }}
            value={inputValue}
            onChange={handleInput}
        />
    );
}
