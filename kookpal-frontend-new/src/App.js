// src/App.js
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import KooKpal from './components/KooKpal';
import './index.css';  

function App() {
  return (
    <AuthProvider>
      <KooKpal />
    </AuthProvider>
  );
}

export default App;