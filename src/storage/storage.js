import { ref, uploadBytesResumable } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";

export const uploadPhotoAndUpdateProfile = async (photoURL, fileName) => {

  const storage = getStorage();
  const storageRef = ref(storage, fileName);
  const response = await fetch(photoURL);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: "image/jpeg" }  );
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% complete");

      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};