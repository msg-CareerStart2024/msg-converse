import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Channel } from '../../../types/channel/channel.types';

const initialState = [] as Channel[];
const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: (state, action: PayloadAction<Channel[]>) => action.payload
    }
});

export const { setChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
