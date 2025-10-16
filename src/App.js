
import React , { useEffect, useState } from 'react';
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Welcome from "./pages/Welcome"
import "./style.scss";
import { BrowserRouter , Routes, Route } from 'react-router-dom';

import MyEdit from './components/MyEdit';
import UserDetails from './pages/UserDetails';
import Userspage from './pages/Userspage';
import FriendPage from './components/FriendPage';
import Friends from './components/Friends';
import Mainpage from './components/Mainpage'
//import Test from "./components/Test";
import ProfilePage from "./components/ProfilePage";
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from "./pages/ResetPassword";
import VerifyEmailPrompt from './components/VerifyEmailPrompt';
import VerifyEmail from './components/VerifyEmail';
import ResetPasswordPrompt from './components/ResetPasswordPrompt';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useUser } from './components/UserContext';




function App() {
  const {seTheMainUser, isGroupChat, setIsGroupChat} = useUser();
 



  const handleFacebookLogin = (authResponse) => {
    const { userID, accessToken } = authResponse;
    // Fetch user data from Facebook API using the access token
    FB.api('/me', { fields: 'name,email' }, (response) => {
      seTheMainUser([{ userId: userID, name: response.name, email: response.email }]);
    });
  };
  


  return (
  
    <BrowserRouter>
    
       
   
    <GoogleOAuthProvider
  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
  callbackUrl="616f-2a02-8071-5e71-4260-b0b6-52a5-6ef0-1d40.ngrok-free/auth/callback"
>


     
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home  isGroupChat={isGroupChat}  setIsGroupChat={setIsGroupChat}/>} />
        <Route path="login" element={<Login onLogin={handleFacebookLogin}/>} />
        <Route path="register" element={<Register />} />
        <Route  path="/userdetails/:userId" element={<UserDetails/>} />
        <Route  path="/userspage" element={<Userspage/>} />
        <Route path="/user/:uid" element={<MyEdit />} />
       
        <Route path="/main" element={<Mainpage />} />
      {/* <Route path="/Test" element={<Test />} /> */}
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/verify-email-prompt" element={<VerifyEmailPrompt />} />
        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/pass-reset-prompt" element={<ResetPasswordPrompt />}/>
        <Route path="/friends" element={<Friends />} />
  
        <Route path="*" element={<NotFound />} />
    
    </Routes>

    </GoogleOAuthProvider>

   
  </BrowserRouter>

  );
}
const NotFound = () => {
  return <div>Page not found</div>;
};
export default App;
