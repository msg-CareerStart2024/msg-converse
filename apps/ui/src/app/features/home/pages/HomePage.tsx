import { useGetChannelsQuery } from '../../../api/channels-api/channelsApi';
import HomeView from '../components/HomeView';

export default function HomePage() {
    useGetChannelsQuery('');
    // const channels = useSelector((state: RootState) => state.channels);

    return <HomeView channels={[]} />;
}
