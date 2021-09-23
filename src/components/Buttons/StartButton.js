import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Buttons.module.css';

const StartButton = () => (
    <NavLink className={styles.btn} to="/play">Start</NavLink>
);

export default StartButton;