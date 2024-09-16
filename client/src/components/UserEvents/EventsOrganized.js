import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
  const { index, style } = props;

  return (
    <div className='border-t-[1px] border-gray-500'>
      <ListItem 
        className='h-fit' 
        key={index} component="div" disablePadding
      >
        <ListItemButton>
          <div className='px-4 hover:bg-[#181f2a] w-full h-20'>  ok  </div>
        </ListItemButton>
      </ListItem>  
    </div>
  );
}

export default function VirtualizedList() {
  return (
    <Box
      sx={{ width: '100%', color: 'white' }}
      className='primary-bg hover:shadow-2xl hover:shadow-gray-400'
    >
      <FixedSizeList
        height={Math.round(screen.height / 2)}
        // width={360}
        itemSize={80}
        itemCount={200}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList> 
    </Box>
  );
}