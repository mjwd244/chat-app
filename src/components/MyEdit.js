    import { useState } from 'react';
    import  React from 'react';
    import {useUser} from './UserContext'

    import MyEditCss from'../MyEdit.module.css' 

    const MyEdit =() =>{
        

    const {mainuser} = useUser()
    const [name, setName] = useState('majd')
    const [photo, setPhoto] = useState()    



    const handlePhotoChange =(e) => {
        setPhoto(e.traget.files[0])
    }

    const uploadPhoto =() =>{
    console.log(name)
    }


    return(

    <>
    <div className={MyEditCss.container}>

    <div className={MyEditCss.sidebar}>

    <div className={MyEditCss.profiledDiv}> account owner: <a> {mainuser[0].displayName}</a> </div>
    

    </div>

    <div className={MyEditCss.maincontent}>

    <form className={MyEditCss.forms} onSubmit={uploadPhoto}>
    

    <div className={MyEditCss.maincontent__photo}> <img src={mainuser[0].photo} ></img></div>
    <label>displayName</label>
    <input type='text' placeholder='username'  onChange={(e) => setName(e.target.value)}></input>
    <label>Change User Photo</label>
    <input type='file' onChange={handlePhotoChange}></input>



    <button className={MyEditCss.button} type="submit"> Back</button>

    </form>
    <div className={MyEditCss.appealingPhoto}> </div>

    </div>


    </div>
    




    </>




    )















    }


    export default MyEdit;