import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import HomeView from '../components/HomeView';

export default function HomePage() {
    const channels = useSelector((state: RootState) => state.channels);
    return <HomeView channels={channels} />;
}
