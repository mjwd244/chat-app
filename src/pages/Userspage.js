import React, { useEffect,useState } from 'react';
import userpagesCss from '../userspages.module.css'; 
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, doc,getDoc, onSnapshot } from "firebase/firestore";
import {firestore} from '../firebaseconfig'



function Userspage() {
  const location = useLocation();
  const { state } = location;
  const { searchTerm } = state || {};
  const [suggestedResults, setSuggestedResults] = useState([]);
  

  const q = query(collection(firestore, 'users'),
  where('displayName', '>=', searchTerm),
   where('displayName', '<=', searchTerm + '\uf8ff'));

useEffect(() => {
const unsubscribe = onSnapshot(q, (snapshot) => {
 const results = snapshot.docs.map((doc) => ({
   id: doc.id,
...doc.data(),

 }));
 setSuggestedResults(results);
});

return () => unsubscribe();
}, [searchTerm]);

useEffect(() => {
  console.log(suggestedResults);
}, [suggestedResults]);



  return (
      <>
      {suggestedResults.map((result) => (
        <div className={userpagesCss.container}>
      <div className={userpagesCss.userspage} >
      <div className={userpagesCss.userdetails} key={result.id}>
      <h2 className={userpagesCss.h2}>{result.displayName}</h2>
      <p className={userpagesCss.p} >{result.email}</p>
      </div>
      <span className={userpagesCss.span} >---------</span>
      </div>
      </div>
      ))}
      </>
  );
}

export default Userspage;