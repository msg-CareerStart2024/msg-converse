import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import HomeView from '../components/HomeView';
import { useEffect } from 'react';
import { setChannels } from '../../channels/slices/channels-slice';

export default function HomePage() {
    const channels = useSelector((state: RootState) => state.channels);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(
            setChannels([
                {
                    id: '1',
                    name: 'Channel 1',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                },
                {
                    id: '2',
                    name: 'New channel 2',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                },
                {
                    id: '3',
                    name: 'Random Channel 3',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                },
                {
                    id: '4',
                    name: 'Test Channel 4',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                },
                {
                    id: '5',
                    name: 'A Channel 5',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                },
                {
                    id: '6',
                    name: 'B Channel 6',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                },
                {
                    id: '7',
                    name: 'C Channel 6',
                    description: 'This is a description',
                    createdAt: new Date(),
                    topics: [{ id: 'topic1', name: 'Topic 1' }]
                }
            ])
        );
    }, []);

    return <HomeView channels={channels} />;
}
