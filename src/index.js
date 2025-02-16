import React from 'react';
import ReactDOM from 'react-dom/client';
import { styles } from '@fortawesome/fontawesome-svg-core';
import App from './App';
import { UserProvider } from './components/UserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    
    <UserProvider>
    <App />
    </UserProvider>
   
  </>
);

