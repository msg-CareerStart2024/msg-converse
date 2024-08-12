import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import HomeView from '../components/HomeView';
import { useGetChannelsQuery } from '../../../api/channels-api';

export default function HomePage() {
    useGetChannelsQuery('');
    const channels = useSelector((state: RootState) => state.channels);

    return <HomeView channels={channels} />;
}
