import React from 'react'
import Box from '@material-ui/core/Box'

export default function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
    >
      {value === index && (
        <Box padding={3}>
          {children}
        </Box>)}
    </div>
  );
}
