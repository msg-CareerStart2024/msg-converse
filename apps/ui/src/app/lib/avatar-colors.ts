import {
    amber,
    blue,
    cyan,
    deepOrange,
    deepPurple,
    green,
    indigo,
    pink,
    red,
    teal
} from '@mui/material/colors';

export const getColor = (letter: string) => {
    const colors = [
        deepOrange[500],
        deepPurple[500],
        indigo[500],
        pink[500],
        cyan[500],
        pink[500],
        cyan[500],
        red[500],
        deepOrange[500],
        deepPurple[500],
        blue[500],
        deepPurple[500],
        blue[500],
        green[500],
        red[500],
        amber[500],
        teal[500],
        pink[500],
        cyan[500],
        deepOrange[500],
        indigo[500],
        blue[500],
        green[500],
        amber[500],
        indigo[500],
        teal[500],
        red[500],
        green[500],
        amber[500],
        teal[500]
    ];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
};
