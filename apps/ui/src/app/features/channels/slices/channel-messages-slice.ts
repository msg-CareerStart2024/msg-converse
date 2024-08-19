import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Message } from '../../../types/messages/Message.types';
import { NewMessagePayload } from '../../../types/socket/payloads/NewMessagePayload.interface';
import { PreviousMessagesPayload } from '../../../types/socket/payloads/PreviousMessagesPayload.interface';

interface ChannelMessagesState {
    [channelId: string]: Message[];
}

const initialState: ChannelMessagesState = {};

const channelMessagesSlice = createSlice({
    name: 'channelMessages',
    initialState,
    reducers: {
        setPreviousMessages: (state, action: PayloadAction<PreviousMessagesPayload>) => {
            const { channelId, messages } = action.payload;
            state[channelId] = messages;
        },
        addNewMessage: (state, action: PayloadAction<NewMessagePayload>) => {
            const { channelId, message } = action.payload;
            if (!state[channelId]) {
                state[channelId] = [];
            }
            state[channelId].push(message);
        }
    }
});

export const { setPreviousMessages, addNewMessage } = channelMessagesSlice.actions;
export default channelMessagesSlice.reducer;
