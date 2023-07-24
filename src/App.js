import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route,Link  } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Home from './views/Home';
import ArticlePage from './views/ArticlePage';
import Articlespage from './views/Articlespage';
import Forexpage from './views/Forexpage';
import CryptoExchangepage from './views/CryptoExchangepage';

function App() {
  return (
    <div >
    <Router >         
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="/ArticlePage" element={<ArticlePage />}></Route>
              <Route path="/Articlespage" element={<Articlespage />}></Route>
              <Route path="/Forexpage" element={<Forexpage />}></Route>
              <Route path="/CryptoExchangepage" element={<CryptoExchangepage />}></Route>
            
            </Routes>
        </Router>    
    </div>
  );
}

export default App;
