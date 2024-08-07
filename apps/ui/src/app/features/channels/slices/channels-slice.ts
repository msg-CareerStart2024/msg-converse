import { Channel } from '../../../types/channels/Channel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = [] as Channel[];
const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: (state, action: PayloadAction<Channel[]>) => action.payload,
        clearChannels: () => []
    }
});

export const { setChannels, clearChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
