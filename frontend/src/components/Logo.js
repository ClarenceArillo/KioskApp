import React from 'react'
import { useStyles } from '../styles';

export default function Logo(props) {
    const styles = useStyles();
    
    const getLogoClass = () => {
        if (props.extraLarge) return styles.extraLargeLogo;
        if (props.large) return styles.largeLogo;
        return styles.logo;
    };
    
    return (
        <img 
            src="/images/Logo.png" 
            alt="food order" 
            className={getLogoClass()}
        />
    );
}