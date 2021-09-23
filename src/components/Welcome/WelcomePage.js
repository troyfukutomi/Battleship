import React from 'react';
import StartButton from '../Buttons/StartButton';
import styles from './Welcome.module.css';

const WelcomePage = () => {


    return(
        <div className={styles.background}>
            <h1 className={styles.centerText}>
                Welcome to Battleship. Let's Begin!
            </h1>
            <StartButton />
        </div>
    )
}
export default WelcomePage;