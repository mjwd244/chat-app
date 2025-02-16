import { useEffect } from 'react';

const FacebookSDKLoader = () => {
  useEffect(() => {
    // Load the Facebook SDK script
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '1700419007381213', // Replace with your Facebook App ID
          cookie     : true,
          xfbml      : true,
          version    : 'v10.0'
        });
        
        FB.AppEvents.logPageView();   
        console.log('Facebook SDK initialized');
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         js.onload = () => console.log('Facebook SDK script loaded');
         js.onerror = (error) => console.error('Error loading Facebook SDK script:', error);
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    };

    loadFacebookSDK();
  }, []);

  return null;
};

export default FacebookSDKLoader;