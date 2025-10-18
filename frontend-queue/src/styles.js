import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
  queueRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100vh',
  },
  queueHeader: {
    width: '100%',
    backgroundColor: '#ff1744',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
  },
  headerText: {
    fontWeight: 'bold',
  },
  queueContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '40px', 
  },
  queueGrid: {
    width: '80%',
  },
  queueColumn: {
    textAlign: 'center',
  },
  queueTitle: {
    color: '#ff1744',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dividerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  verticalDivider: {
    height: '250px',
    borderColor: 'rgba(255, 0, 0, 0.3)', 
    borderRightStyle: 'solid',
    opacity: 0.8, 
  },
  queueList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  queueItem: {
    margin: '10px 0',
  },
}));
