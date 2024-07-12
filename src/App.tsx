import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Main from './main'; // Assuming you have a Main component for the main page
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './Configuration/firebase';

const App: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/login" /> : <Navigate to="/main" />} />
        <Route path="/login" element={user ? <Navigate to="/main" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/login" /> : <Register />} />
        <Route path="/main" element={user ? <Main /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
