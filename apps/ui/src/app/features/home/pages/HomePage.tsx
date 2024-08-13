import { useSelector } from 'react-redux';
import { useGetChannelsQuery } from '../../../api/channels-api/channelsApi';
import { RootState } from '../../../store/store';
import HomeView from '../components/HomeView';

export default function HomePage() {
    useGetChannelsQuery('');
    const channels = useSelector((state: RootState) => state.channels);

    return <HomeView channels={channels} />;
}
