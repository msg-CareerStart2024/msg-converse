import HomeView from '../components/HomeView';
import { useGetChannelsQuery } from '../../../api/channels-api';
import { useState } from 'react';

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: channels } = useGetChannelsQuery(searchTerm);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    return <HomeView channels={channels} onSearch={handleSearch} />;
}
