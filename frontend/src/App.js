import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Invites from "./components/Invites"
import ChatRoom from './components/ChatRoom';
import Auth from './components/Auth';


const App = () => {
  return (
    <Router>
      <div style={styles.background}>
        <Routes>
          <Route exact path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home/:username" element={<Home />} />
          <Route path="/chat/:userId/:username" element={<ChatRoom />} />
          <Route path="/invites" element={<Invites />} />

        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  background: {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    height: '100vh',
    padding: 0,
    margin: -8
  },
};

export default App;
