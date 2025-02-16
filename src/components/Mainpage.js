import React, { useRef, useEffect } from 'react';
import styles from '../MainPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';


const Mainpage = () =>{

    const hamburgerMenuRef = useRef(null);
    useEffect(() => {
        if (hamburgerMenuRef.current) {
          hamburgerMenuRef.current.addEventListener('click', () => {
            hamburgerMenuRef.current.classList.toggle('active');
          });
        }
      }, []);
      library.add(fas, far, fab);
    
return(

<div className={styles.wholecontainer}>


    <div className={styles.maincontainer} >

        <div className={styles.logo}> 
        <FontAwesomeIcon icon="fa-solid fa-house" />
        <span className={styles.spacingspan}>Casap</span>
        </div>

        <nav className={styles.navlinks}>
            <ul>
                <li><FontAwesomeIcon icon="fa-regular fa-calendar" /><a href="#">Agenda</a></li>
                <li><FontAwesomeIcon icon="fa-solid fa-house-lock" /><a href="#">Dossiers / Offres</a></li>
                <li><FontAwesomeIcon icon="fa-regular fa-address-card" /><a href="#">Contacts</a></li>
            </ul>
        </nav>

        <div className={styles.profile}>
            <FontAwesomeIcon icon="fa-solid fa-bars"  className={styles.bars}/>
            <img src="/images/newone.jpg" alt="Profile Icon"/>
        </div>

    </div>

    <div className={styles.betweenbar}>

        <div className={styles.container1}>
            <span>tous</span>
            <span>Contacts</span>
            <span>Visites</span>
            <span>Dossiers</span>
            <span>Archives</span>
        </div>

        <div className={styles.container2}>
            <div className={styles.searchthing}>🔍</div>
            <div className={styles.settings}>⚙️</div>
            <div className={styles.glock}>🔔</div>
            <div className={styles.hamburgermenu}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                Filters
            </div>
        </div>    

    </div>


    <div className={styles.sidebarundrightbar}>

        <div className={styles.sidebar}>
       
            <div className={styles.sidebarcontent}>

                <div className={styles.userinfo}>
                     <div className={styles.symbol}>FE</div>
                     <div className={styles.username}>Fabrice Edouard</div>
                     <div className={styles.userstate}>Interested</div>
                     <div className={styles.userdetails}>08:23</div>
                </div>

                <div className={styles.useravatar}>
                    <div className={styles.avatr}> <span>User Address</span></div>
                    <div className={styles.useraddress}>8 rue Lavoisier 75008 Paris</div>
                    <div className={styles.chatsymbol}><span>&#x1F4AC;</span></div>
                </div>

            </div>

            <div className={styles.sidebarcontent}>

                <div className={styles.userinfo}>
                     <div className={styles.symbol}>FE</div>
                     <div className={styles.username}>Fabrice Edouard</div>
                     <div className={styles.userstate}>Interested</div>
                     <div className={styles.userdetails}>08:23</div>
                </div>

                <div className={styles.useravatar}>
                     <div className={styles.avatr}> <span>User Address</span></div>
                     <div className={styles.useraddress}>8 rue Lavoisier 75008 Paris</div>
                     <div className={styles.chatsymbol}><span>&#x1F4AC;</span></div>
                </div>

            </div>

            <div className={styles.sidebarcontent}>

                <div className={styles.userinfo}>
                    <div className={styles.symbol}>FE</div>
                    <div className={styles.username}>Fabrice Edouard</div>
                    <div className={styles.userstate}>Interested</div>
                    <div className={styles.userdetails}>08:23</div>
                </div>

                <div className={styles.useravatar}>
                    <div className={styles.avatr}> <span>User Address</span></div>
                    <div className={styles.useraddress}>8 rue Lavoisier 75008 Paris</div>
                    <div className={styles.chatsymbol}><span>&#x1F4AC;</span></div>
                </div>
   
            </div>

            <div className={styles.sidebarcontent}>

                <div className={styles.userinfo}>
                    <div className={styles.symbol}>FE</div>
                    <div className={styles.username}>Fabrice Edouard</div>
                    <div className={styles.userstate}>Interested</div>
                    <div className={styles.userdetails}>08:23</div>
                </div>

                <div className={styles.useravatar}>
                    <div className={styles.avatr}> <span>User Address</span></div>
                    <div className={styles.useraddress}>8 rue Lavoisier 75008 Paris</div>
                    <div className={styles.chatsymbol}><span>&#x1F4AC;</span></div>
                </div>
   
            </div>

            <div className={styles.sidebarcontent}>

                <div className={styles.userinfo}>
                    <div className={styles.symbol}>FE</div>
                    <div className={styles.username}>Fabrice Edouard</div>
                    <div className={styles.userstate}>Interested</div>
                    <div className={styles.userdetails}>08:23</div>
                </div>

                <div className={styles.useravatar}>
                    <div className={styles.avatr}> <span>User Address</span></div>
                    <div className={styles.useraddress}>8 rue Lavoisier 75008 Paris</div>
                    <div className={styles.chatsymbol}><span>&#x1F4AC;</span></div>
                </div>
   
            </div>


            <div className={styles.pagination}>
                    <ul>
                        <li><a href="" className={styles.active}>1</a></li>
                        <li><a href="">2</a></li>
                        <li><a href="">3</a></li>
                        <li><a href="">4</a></li>
                        <li><a href="">5</a></li>
                    </ul>
                    <span>▶</span>
            </div>


        </div>


        <div className={styles.rightbar}>

            <div className={styles.iconsDiv}>

                <div className={styles.con1}>
                    <span> <FontAwesomeIcon icon="fa-solid fa-xmark" /> </span>
                    <span> <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" /></span>
                    <span> ▲</span>
                    <span> ▼</span>  
                </div>

                <div className={styles.con2}>
                    <h3>vor deateus cadndidnts (▲ ▼ pour navigator)</h3>
                </div>

                <div className={styles.con3}>
                    <h3>jeudi spetember 16:27</h3>
                    <span><FontAwesomeIcon icon="fa-solid fa-comment" className={styles.chatsymbols} /></span>
                    <span><FontAwesomeIcon icon="fa-solid fa-ellipsis" className={styles.fontcolor}/></span>
                </div>

            </div>

            <div className={styles.topbar}>
                <h2>Location</h2>
                <span>Salarie en CD</span>
                <span>3200/.mois</span>
            </div>

            <h1> Gabrielle Arduino</h1>

            <div className={styles.smoothbar}>
                <span><FontAwesomeIcon icon="fa-solid fa-bag-shopping"  /></span><p>planzier de rd</p>
                <span><FontAwesomeIcon icon="fa-solid fa-folder" /></span><p>depot dossier</p>
                <span><FontAwesomeIcon icon="fa-solid fa-download"/></span><p>Archiever</p>
            </div>

            <div className={styles.fotoconandtext}>
                <img src="/images/newone.jpg"/>
                <div className={styles.columndisplay}>
                    <span>y32323</span>
                    <span>54 rue der fountain mtatate 750123 paris</span>
                </div>
                <div className={styles.lastdiv}>
                    <span><FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square" /></span>
                    <p>voris le bein</p>
                </div>
            </div>

            <div className={styles.gridcontent}>
                <div className={styles.column1}>
                    <span><FontAwesomeIcon icon="fa-regular fa-folder" className={styles.iconspacing}/>Dossier</span>
                    <span><FontAwesomeIcon icon="fa-solid fa-phone" className={styles.iconspacing}/>Tel</span>
                    <span><FontAwesomeIcon icon="fa-regular fa-envelope" className={styles.iconspacing}/>Email</span>
                    <span><FontAwesomeIcon icon="fa-regular fa-images" className={styles.iconspacing}/>Status</span>     
                    <span><FontAwesomeIcon icon="fa-solid fa-person" className={styles.iconspacing}/>Agents</span>
                </div>
                <div className={styles.column2}>
                    <div className={styles.rowincolumn2}>
                        <span>Dossier locag</span><span className={styles.precent}>100%</span>
                    </div>
                    <span>+33 60 1555 733</span>
                    <span>gaby.dujandan@gmail.com</span>
                    <span>antenne de visite</span>
                    <span className={styles.imgspan}> <img src="/images/newone.jpg"></img>matheio debuk</span>   
                </div>
                <div className={styles.column3}>
                    <span><FontAwesomeIcon icon="fa-solid fa-arrows-rotate" /></span> 
                    <span><FontAwesomeIcon icon="fa-solid fa-note-sticky" /></span>    
                </div>
            </div>      

            <div className={styles.rowaftergrid}>
                <span>Dossier</span>
                <span>Histerque</span>
                <span>Questinere</span>
                <span>Rendenz-vous</span>
            </div>

            <div className={styles.describingbox}>

                <div className={styles.rowbefore}>
                    <span><FontAwesomeIcon icon="fa-solid fa-angle-right" /></span>
                    <span>piece d idneite</span>
                    <span class={styles.obligatore}>Obligartore</span>
                    <span className={styles.iconspan}><FontAwesomeIcon icon="fa-solid fa-check" /></span>
                </div>

                <div className={styles.boxcolumn}>

                    <div className={styles.row1}>
                        <span className={styles.span1}><FontAwesomeIcon icon="fa-solid fa-angle-down" /></span>
                        <span className={styles.text}>justifiy de domnice</span>
                        <span className={styles.span3}>Obligartore</span>
                        <span class={styles.iconnike}><FontAwesomeIcon icon="fa-solid fa-check" /></span>
                    </div>

                    <div className={styles.row2}>
                        <span className={styles.firstspan}>Doc</span>
                        <div className={styles.columncon}>
                            <span className={styles.columnspan1}>Documentanstire.pdf</span>
                            <span className={styles.columnspan2}>date:16.2.2024 4mo</span>
                        </div>
                        <span className={styles.icon}><FontAwesomeIcon icon="fa-solid fa-dumpster" /></span>
                    </div>

                </div>

            </div>

        </div>

    </div>

</div>

    );
}

export default Mainpage;