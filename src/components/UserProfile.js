import React, { useContext, useRef, useState } from 'react';
import { useUser } from './UserContext';
import { useParams } from 'react-router-dom';
import '../UserProfile.css'; // Add this line
import {firestore} from '../firebaseconfig'
import {  doc,collection,addDoc ,serverTimestamp,updateDoc   } from "firebase/firestore";
import { storage } from '../firebaseconfig';

import { uploadPhotoAndUpdateProfile } from '../newStorage';

const UserProfile = () => {
    const { uid } = useParams();
  const { mainuser, seTheMainUser } = useUser();
  const inputRef = useRef();
  const fileInputRef = useRef();
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(mainuser.photo);

  const handleEdit = () => {
    const newDisplayName = inputRef.current.value;
    updateUserNameInFirestore(newDisplayName);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setNewPhoto(file);
    // Call the uploadPhotoAndUpdateProfile function
  };

  const handlePhotoUpload = () => {
    uploadPhotoAndUpdateProfile(newPhoto)
      .then((downloadURL) => {
        console.log('Photo uploaded successfully:', downloadURL);
        // Update the user's profile with the new photo URL
        updatePhotoInFirestore(downloadURL);
      })
      .catch((error) => {
        console.error('Error uploading photo:', error);
      });
  };

  const updateUserNameInFirestore = async (newDisplayName) => {
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, {
      displayName: newDisplayName,
    })
      .then(() => {
        seTheMainUser({ ...mainuser, displayName: newDisplayName });
      })
      .catch((error) => console.error(error));
  };
  const updatePhotoInFirestore = async (newPhotoUrl) => {
    try {
      const userRef = doc(firestore, "users", uid);
      await updateDoc(userRef, {
        photoURL: newPhotoUrl,
      });
      seTheMainUser({ ...mainuser, photo: newPhotoUrl });
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <img src={mainuser[1].photo} alt="    " />
      <p>
        <strong>Display Name:</strong> {mainuser[1].displayName}
      </p>
      <p>
        <strong>User ID:</strong> {mainuser[0].userId}
      </p>
      <input
        type="text"
        placeholder="Edit display name"
        ref={inputRef}
        defaultValue={mainuser[1].displayName}
      />    
      <button onClick={handleEdit}>Save Changes</button>
      <br />
      <br />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
      />
      <button onClick={handlePhotoUpload}>Upload New Photo</button>
    </div>
  );
};
export default UserProfile;
