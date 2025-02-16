import React from 'react';
import styles from '../Test.module.css';

const Test = () => {
  return (
    <div>
      <div className={styles.menu}>
        <h1 className={styles.name}><a href="#">MySite</a></h1>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">MySite</a></li>
          <li><a href="#">Contact</a></li>
          <li className={styles.buttonSignUp}><a href="#">Sign Up</a></li>
        </ul>
      </div>

      <div className={styles.body}>
        <div className={styles.sideLeft}>
          <p>We are the best website in the world!<br />and we can be the real best in team.<br /><em>Join us now!</em><br /><br />
            <button>JOIN NOW</button>
          </p>
        </div>
        <div className={styles.center}>
          <p>We are the pre-best website in the world!<br />and we can be the real pre-best in team.<br /><em>Join us now!</em><br /><br />
            <button style={{ border: '1px solid red' }} id="btn" >JOIN NOW</button>
          </p>
        </div>
        <div className={styles.sideRight}>
          <p>We are the third-best website in the world!<br />and we can be the real third-best in tea<br /><em>Join us now!</em><br /><br />
            <button>JOIN NOW</button>
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.box1}>
          <div className={styles.img}></div>
          <div className={styles.content}>
            <h5>04/07/2022</h5>
            <h1>#CE7870</h1>
          </div>
          <div className={styles.footer}>footer</div>
        </div>
      </div>

      <div className={styles.footer}>copyright (c)</div>
    </div>
  );
};

export default Test;