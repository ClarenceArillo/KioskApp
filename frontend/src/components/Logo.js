import React from 'react'
import { useStyles } from '../styles';

export default function Logo(props) {
    const styles = useStyles();
    
  return (
    <img 
    src="/images/new-logo.png" 
    alt="food order" 
    className={props.large?styles.largeLogo: styles.logo}
    ></img>
  );
}
