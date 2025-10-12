  import { makeStyles } from '@mui/styles';

  export const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    chooseRoot: {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
},

    cardFull: {
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
    boxShadow: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
    fullRedScreen: {
  backgroundColor: '#ff2040',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
},


    navy: {
      backgroundColor: '#003080',
    },
    red: {
      backgroundColor: '#ff2040',
      color: '#ffffff',
    },
    main: {
      flex: 1,
      overflow: 'auto',
      flexDirection: 'column',
      display: 'flex',
      color: '#ffffff',
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    green: {
      backgroundColor: '#00b020',
    },
    largeLogo: {
      height: 70,
    },
    logo: {
      height: 50,
    },
    cards: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: { 
  margin: 10,
  maxWidth: 300, 
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
},

    space: {
      padding: 10,
    },
    media: { width: 200 },
    largeButton: {
      width: 250,
    },
    menuImage: {
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderRadius: 8,
},

    largeInput: {
      width: '60px!important',
      padding: '0!important',
      fontSize: '35px!important',
      textAlign: 'center!important',
    },
    bordered: {
      borderWidth: 2,
      borderRadius: 5,
      margin: 5,
      borderStyle: 'solid',
    },
    row: {
      display: 'flex',
      padding: 10,
    },
    around: {
      justifyContent: 'space-around',
    },
    between: {
      justifyContent: 'space-between',
    },
    column: { flexDirection: 'column' },
  }));