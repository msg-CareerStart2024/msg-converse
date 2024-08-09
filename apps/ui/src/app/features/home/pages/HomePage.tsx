import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import HomeView from '../components/HomeView';
import { useGetChannelsQuery } from '../../../api/channelsApi';
import React from 'react';

export default function HomePage() {
    useGetChannelsQuery('');
    const channels = useSelector((state: RootState) => state.channels);

    return <HomeView channels={channels} />;
}
