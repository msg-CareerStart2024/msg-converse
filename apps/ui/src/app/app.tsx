import { Route, Routes } from 'react-router-dom';
import Login from './features/login/pages/Login';

export function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
