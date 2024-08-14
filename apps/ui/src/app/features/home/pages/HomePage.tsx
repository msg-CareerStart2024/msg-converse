import HomeView from '../components/HomeView';
import { useGetChannelsQuery } from '../../../api/channels-api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            channels={searchTerm.length > 0 ? channels?.slice(0, 3) : channels}
            onSearch={handleSearch}
            handleNavigateToCreateChannel={handleNavigateToCreateChannel}
        />
    );
}
