import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommunityList from '../components/Communities/CommunityList';
import CommunityDetails from '../components/Communities/CommunityDetails';
import CreateCommunity from '../components/Communities/CreateCommunity';
import PeopleList from '../components/People/PeopleList';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/communities" element={<CommunityList />} />
        <Route path="/community/:id" element={<CommunityDetails />} />
        <Route path="/create-community" element={<CreateCommunity />} />
        <Route path="/people" element={<PeopleList />} />
      </Routes>
    </Router>
  );
};
