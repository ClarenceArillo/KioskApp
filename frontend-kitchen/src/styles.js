import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
orderRoot: {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#fff',
},

orderHeaderRed: {
  backgroundColor: '#ff2040',
  color: '#fff',
  textAlign: 'center',
  padding: '8px 0',
  fontWeight: 'bold',
},

orderHeaderGreen: {
  backgroundColor: 'green',
  color: '#fff',
  textAlign: 'center',
  padding: '8px 0',
  fontWeight: 'bold',
},

orderMain: {
  display: 'flex',
  flexGrow: 1,
  padding: 16,
  height: 'calc(100vh - 80px)'
},

orderList: {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  overflowY: 'auto',
  maxHeight: '100%'
},

orderListItem: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '80%',
  marginBottom: 8,
  padding: 8,
  border: '1px solid #ccc',
  borderRadius: 4,
},

orderDividerRed: {
  margin: '0 16px',
  borderColor: '#ff2040',
},

orderDividerGreen: {
  margin: '0 16px',
  borderColor: 'green',
},

orderDetailsRed: {
  flex: 2,
  backgroundColor: '#fff5f5',
  borderRadius: 4,
  padding: 16,
},

orderDetailsGreen: {
  flex: 2,
  backgroundColor: '#f5fff5',
  borderRadius: 4,
  padding: 16,
},

orderHeaderBoxRed: {
  backgroundColor: '#ff2040',
  color: 'white',
  padding: 16,
  marginBottom: 16,
  borderRadius: 4,
},

orderHeaderBoxGreen: {
  backgroundColor: 'green',
  color: 'white',
  padding: 16,
  marginBottom: 16,
  borderRadius: 4,
},

tabContainer: {
  display: 'flex',
  justifyContent: 'center',
  gap: 16,
  padding: 8,
  backgroundColor: '#333',
},

tabButtonRed: {
  backgroundColor: '#b71c1c !important',
  color: 'white !important',
  borderColor: '#ff2040 !important',
  width: 150,
},

tabButtonGreen: {
  backgroundColor: 'green !important',
  color: 'white !important',
  borderColor: 'green !important',
  width: 150,
},
}));