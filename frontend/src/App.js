import './App.css';

import Theme from './context/Theme';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import AppFooter from './components/Footer';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Theme>
        <div className="App">
          <Header />
          <Dashboard />
          <AppFooter />
        </div>
      </Theme>
    </BrowserRouter>
  );
}

export default App;
