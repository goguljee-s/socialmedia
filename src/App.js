import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/sidenav/nav';
import Home from './components/home';
import Register from './components/Register/Register';
import CommentLayout from './components/timeLine/post/CommentLayout';
import { ContextProvider, DataContext } from './contexts/ContextProvider';
import UserView from './components/userView/UserView';
import { useContext, useEffect } from 'react';

function App() {
  const { darkMode } = useContext(DataContext);
  useEffect(() => {
    
  },[darkMode])
  return (
    <div className={darkMode?"darkmode":""}>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Register />} index />
        </Routes>
      </Router>
    </div>
  );
  }
export default App;
