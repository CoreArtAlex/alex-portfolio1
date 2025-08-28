import './App.css';
//import './components/Quote.css';
//import './components/Calculate.css';
//import './components/Music.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import MusicPlayer from './pages/MusicPlayer';
import QuoteGen from './pages/QuoteGen';
import PongGame from './pages/PongGame';
import Layout from './Layout';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quotegen" element={<QuoteGen />} />
          <Route path="/musicplayer" element={<MusicPlayer />} />
          <Route path="/ponggame" element={<PongGame />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
