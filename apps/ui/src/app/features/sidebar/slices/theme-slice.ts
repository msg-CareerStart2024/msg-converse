import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const validThemes = ['dark', 'light', 'system'];

const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system';

const initialState: 'dark' | 'light' | 'system' = validThemes.includes(savedTheme)
    ? savedTheme
    : 'system';

if (!savedTheme || !validThemes.includes(savedTheme)) {
    localStorage.setItem('theme', initialState);
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'dark' | 'light' | 'system'>) => {
            const newTheme = action.payload;
            localStorage.setItem('theme', newTheme);
            return newTheme;
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
