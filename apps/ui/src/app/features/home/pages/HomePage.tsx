import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery } from '../../../api/channels-api/channels-api';
import HomeView from '../components/HomeView';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const { data: channels } = useGetChannelsQuery(searchTerm);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    const handleNavigateToCreateChannel = () => {
        navigate('/channels/new');
    };

    return (
        <HomeView
            channels={channels}
            onSearch={handleSearch}
            handleNavigateToCreateChannel={handleNavigateToCreateChannel}
        />
    );
}
