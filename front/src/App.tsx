import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/header/header';
import { AllCats } from './pages/all-cats/all-cats';
import { FavoriteCats } from './pages/favorite-cats/favorite-cats';
import { Authorization } from './pages/authorization/authorization';
import { Registration } from './pages/registration/registration';
import { Error } from './pages/error/error';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<AllCats />} />
          <Route path="/login" element={<Authorization />} />
					<Route path="/register" element={<Registration />} />
          <Route path="/favorites" element={<FavoriteCats/>} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;