import React from 'react';
import styles from '../ProfilePage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

const ProfilePage = () => {
  library.add(fas, far, fab);
  
  return (
    <div className={styles.container}>
      <div className={styles.mainbar}>
        <div className={styles.firstcon}>
          <div className={styles.bar}></div>
        </div>

        <div className={styles.secondcon}>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-tv" className={styles.font} />Manager
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-floppy-disk" className={styles.font} />Templates
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-table-tennis-paddle-ball" className={styles.font} />Domains
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-users" className={styles.font} />Manage Teams
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-clock-rotate-left" className={styles.font} />Stats
          </span>
        </div>

        <div className={styles.thirdcon}>
          <span>
            <FontAwesomeIcon icon="fa-regular fa-comment-dots" className={styles.font} />
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-gift" className={styles.font} />
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-road-lock" className={styles.font} />
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-question" className={styles.font} />
          </span>
          <img src="/images/newone.jpg" alt="Profile" />
        </div>
      </div>

      <div className={styles.maincontent}>
        <div className={styles.sidebar}>
          <span>
            <FontAwesomeIcon icon="fa-regular fa-user" className={styles.font} />Profile
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-flag-checkered" className={styles.font} />Notification
          </span>
          <span>
            <FontAwesomeIcon icon="fa-solid fa-tablet-button" className={styles.font} />Status
          </span>
        </div>

        <div className={styles.columnall}>
          <span className={styles.profilespan}>
            <FontAwesomeIcon icon="fa-regular fa-user" id={styles.fontid} /> Profile
          </span>

          <div className={styles.firstrow}>
            <input placeholder="Display Name" />
            <input placeholder="Email" />
          </div>

          <div className={styles.secondrow}>
            <input placeholder="Last Name" />
            <div className={styles.coulmninrow}>
              <input placeholder="Password" />
              <button className={styles.changepassword}>Change Password</button>
            </div>
          </div>

          <div className={styles.languageholder}>
            <span className={styles.languagespan}>Language</span>
            <select>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className={styles.noftifycon}>
            <div className={styles.titlerow}>
              <FontAwesomeIcon icon="fa-solid fa-location-arrow" id={styles.icon} />
              <span>Notifications</span>
            </div>
            <span className={styles.rowaftertitle}>NOTIFY ME WHEN ...</span>

            <div className={styles.checkboxContainer}>
              <div className={styles.gridcon1}>
                <span className={styles.checkmark}>
                  <input type="checkbox" />...a new website is created
                </span>
                <span className={styles.checkmark}>
                  <input type="checkbox" />...any website status changes
                </span>
                <span className={styles.checkmark}>
                  <input type="checkbox" />...a website is assigned to me
                </span>
                <span className={styles.checkmark}>
                  <input type="checkbox" />...a to-do is assigned to me
                </span>
                <span className={styles.checkmark}>
                 
                </span>
              </div>
              <div className={styles.gridcon2}>
                <span className={styles.checkmark}>
                <input type="checkbox" />...a bewsite that am following is changed
                </span>
                <span className={styles.checkmark}>
                <input type="checkbox" />...any website is published (domain changes)
                </span>
                <span className={styles.checkmark}>
                <input type="checkbox" />...a customer sends a message
                </span>
              </div>
            </div>
          </div>

          <div className={styles.Abesncecon}>
              <span className={styles.fontspan}> <FontAwesomeIcon icon="fa-solid fa-location-arrow" className={styles.absenceeicon}/> Absence</span>
              
            <div className={styles.checker}>
              <input type="checkbox" />
              <span className={styles.checkmark}></span>
            </div>
            <span>
              set a date until which you are abesnt so that no websites are assigned to you within that time
            </span>
          </div>
        </div>

        <div className={styles.imgcon}>
          <div className={styles.imgandpinicon}>
            <img src="/images/newone.jpg" alt="Profile" /> 
            <FontAwesomeIcon icon="fa-solid fa-pen" className={styles.FontAwesomeIcon} ></FontAwesomeIcon >
          </div>
          <div className={styles.coulmnofbuttons}>
          <button className={styles.save1}>save</button>
          <button className={styles.save2}>save</button>
          <button className={styles.save3}>save</button>
        
          </div>
        </div>

        <div className={styles.rightbar}>
          <div className={styles.itemsright}>
            
            <span><FontAwesomeIcon icon="fa-solid fa-location-arrow" className={styles.absenceicon}/> Switch Team</span>
         
            <span><FontAwesomeIcon icon="fa-solid fa-user" className={styles.absenceicon}/> Profile</span>
            
            <span><FontAwesomeIcon icon="fa-solid fa-bell" className={styles.absenceicon}/> Notifications</span>
            
            <span><FontAwesomeIcon icon="fa-solid fa-calendar-alt" className={styles.absenceicon}/> Absence</span>
          
            <span><FontAwesomeIcon icon="fa-solid fa-sign-out-alt"className={styles.absenceicon} /> Logout</span>
          </div>

          <div className={styles.questionmark}>
            <FontAwesomeIcon icon="fa-solid fa-question-circle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;



