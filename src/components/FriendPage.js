import React from 'react';
import styles from '../FriendPage.module.scss';

const FriendPage = () => {
  return (
    <div className={styles.friendPage}>




      <div className={styles.mainuserr}>
        <div className={styles.usercon}>

          <div className={styles.imgname}>
            <img src="images/newone.jpg" alt=""/>
            <div className={styles.column1}>
              <p>Main user Name</p>  
            </div>
          </div>

          <div className={styles.buttonscontainer}>
            <button>Back </button>
            <button>Edit profile</button>
            <button>Logout</button>
          </div>

        </div>
      </div>




      <div className={styles.friendcontent}>

          <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
            </div>
          </div>



          <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
            </div>
          </div>

          <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
          </div>
        </div>


        <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
          </div>
        </div>

        <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
          </div>
        </div>

        <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
          </div>
        </div>

        <div className={styles.infoContent}>
            <div className={styles.name}>
              <img src="images/defalt.jpg"></img>
              <p>friendName</p>
              <strong>status</strong>
            </div>
            <div className={styles.removeandview}>
              <button>Remove</button>
              <button>View Profile</button>
              <button>Send Message</button>
          </div>
        </div>
          

      </div>

    </div>
  );
};

export default FriendPage;