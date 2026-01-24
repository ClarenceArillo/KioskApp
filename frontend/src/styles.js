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
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '60px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  choiceCard: {
    width: 350,
    height: 450,
    borderRadius: 20,
    boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-12px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
    },
  },
  cardActionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  choiceMedia: {
    width: '100%',
    height: 320,
    objectFit: 'cover',
    flexGrow: 1,
  },
  cardContent: {
    padding: '25px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
  },
  choiceText: {
    fontWeight: '800',
    fontSize: '2rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    textAlign: 'center',
    margin: 0,
    color: '#ff2040',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  // Logo sizes
  extraLargeLogo: {
    height: 120,
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
  },
  largeLogo: {
    height: 80,
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
  },
  logo: {
    height: 50,
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
    marginBottom: '20px',
  },
  green: {
    backgroundColor: '#00b020',
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
  media: { 
    width: 200 
  },
  largeButton: {
    width: 250,
    fontWeight: '700',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '1rem',
    borderRadius: '8px',
    padding: '12px 24px',
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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '600',
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
  column: { 
    flexDirection: 'column' 
  },

  // Category styles (sidebar menu like your screenshot)
  sidebar: {
    width: '130px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto',
    padding: '10px 0',
    scrollbarWidth: 'thin',
    scrollbarColor: '#ccc transparent',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ccc',
      borderRadius: '3px',
    },
  },
  sidebarLogo: {
    width: '100px',
    marginBottom: '10px',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '10px 0',
    transition: 'all 0.3s ease',
    borderRadius: '16px',
    padding: '6px',
    width: '100px',
    cursor: 'pointer',
  },
  categoryImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  categoryLabel: {
    marginTop: '5px',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#333',
    textAlign: 'center',
  },
  activeCategory: {
    backgroundColor: '#ff2040',
    boxShadow: '0 0 12px rgba(255, 32, 64, 0.6)',
    '& $categoryLabel': {
      color: '#fff',
    },
  },
}));
