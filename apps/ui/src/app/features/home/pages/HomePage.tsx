import { useGetChannelsQuery } from '../../../api/channels-api/channels-api';
import { CHANNEL } from '../../channels/static';
import HomeView from '../components/HomeView';

export default function HomePage() {
    useGetChannelsQuery('');
    // const channels = useSelector((state: RootState) => state.channels);

    return <HomeView channels={[CHANNEL]} />;
}
