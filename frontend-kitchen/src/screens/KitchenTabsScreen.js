import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import PreparingOrdersScreen from './PreparingOrdersScreen';
import DoneOrdersScreen from './DoneOrdersScreen';
import { useStyles } from '../styles';

export default function KitchenTabsScreen() {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('prepare');

  return (
    <Box className={styles.root}>
      <Box className={styles.tabContainer}>
        <Button
          variant={activeTab === 'prepare' ? 'contained' : 'outlined'}
          className={activeTab === 'prepare' ? styles.tabButtonRed : ''}
          onClick={() => setActiveTab('prepare')}
        >
          PREPARE
        </Button>

        <Button
          variant={activeTab === 'done' ? 'contained' : 'outlined'}
          className={activeTab === 'done' ? styles.tabButtonGreen : ''}
          onClick={() => setActiveTab('done')}
        >
          DONE
        </Button>
      </Box>

      <Box style={{ flexGrow: 1 }}>
        {activeTab === 'prepare' ? <PreparingOrdersScreen /> : <DoneOrdersScreen />}
      </Box>
    </Box>
  );
}
