import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Button from '@mui/material/Button';
import Options from '../Options';
import { orange } from '@mui/material/colors';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from '../../constants';

import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { motion, spring, easeInOut, easeOut } from 'framer-motion';

const SidebarLinks = [
  {
    path: '/',
    title: 'Home',
    icon: <HomeIcon fontSize='medium' sx={{ color: orange[900] }} />
  },
  {
    path: '/about',
    title: 'About',
    icon: <InfoOutlinedIcon fontSize='medium' sx={{ color: orange[900] }} />
  },
  {
    path: '/events',
    title: 'Events',
    icon: <EventIcon fontSize='medium' sx={{ color: orange[900] }} />
  },
  {
    path: '/events/create',
    title: 'Create Event',
    icon: <EditCalendarIcon fontSize='medium' sx={{ color: orange[900] }} />
  },
];

const sortOptions = [
  {
    label: 'Sort by Registrations',
    filter: 'registered'
  },
  {
    label: 'Sort by Title',
    filter: 'title'
  }
];

const modeOptions = [
  {
    label: 'Offline',
    filter: 'offline'
  },
  {
    label: 'Online',
    filter: 'online'
  },
];

const TemporaryDrawer = ({ isOpen, setIsOpen }) => {

  const currentUrl = new URL(window.location.href);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(currentUrl.search));

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const sheetWidth = Math.round((75 * screenWidth) / 100);

  const [state, setState] = React.useState({
    right: true,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
  
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div className='min-h-screen bg-[#1f2937]'>

    <Box
      sx={{
        width: sheetWidth,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, true)}
      className={`bg-[#1f2937] text-white h-fit p-6`}
    >
      <button
        className='fixed top-[20px] right-[10px] text-white'
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 scale-110">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

      </button>

      <List className='p-8'>
        <div className='flex flex-col justify-center items-start mt-16 mb-8'>
          {
                    
            SidebarLinks.map((link, index) => (
              <motion.a 
                key={index} 
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 20
                  },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: spring,
                      duration: 0.5,
                      delay: 0.1 * index,
                      ease: easeOut 
                    }
                  }
                }}
                initial='hidden'
                animate='show'
                href={link.path}
                className='hover:bg-slate-700 hover:text-blue-600 w-full my-2 p-[10px] rounded-md'
                onClick={() => setIsOpen(false)}
              >
                <div className='flex items-center gap-4'> <div className='scale-[100%]'> {link.icon} </div> <p className='text-lg'> {link.title} </p> </div>
              </motion.a>
            ))  
                    
          }  
        </div>
      </List>
      <Divider className='bg-[#eeeeee]' />

      <List>
        <motion.div 
          className={`border-2 border-gray-${open ? '600' : '400'} my-10 w-full pb-${open ? '6' : '0'} `} 
          variants={{
            hidden: {
              opacity: 0,
              x: 50
            },
            show: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.75,
                type: spring,
                ease: easeOut
              }
            }
          }}
          initial='hidden'
          animate='show'
        >

          <ListItemButton onClick={handleClick} sx={{ pt : 3, m : 0 }} >
            <div className='flex items-center gap-[6px] mb-4 h-[9px] w-full text-md'> 
              { !open ? <ChevronRightIcon /> : <ExpandMoreIcon /> }  
              Filter Events 
            </div> 
          </ListItemButton>

          <Collapse in={open} timeout="auto" unmountOnExit>

            <List component="div" disablePadding>
              <ListItemButton sx={{ p : 0 }} >
                <button className='w-full p-3 min-[400px]:p-6 pb-2 text-white'>
                  <Options options={sortOptions} handleFilter={(inputValue) => {
                      let copy = searchParams;
                      copy.set('sort_by', inputValue);
                      setSearchParams(copy);
                    }} 
                  />
                </button>
              </ListItemButton>

              <ListItemButton sx={{ p : 0 }} >
                <button className='w-full p-3 min-[400px]:p-6 pb-2 text-white'>
                  <Options options={modeOptions} handleFilter={(inputValue) => {
                      let copy = searchParams;
                      copy.set('mode', inputValue);
                      setSearchParams(copy);
                    }} 
                  />
                </button>
              </ListItemButton>

              <Autocomplete
                className='mb-4 w-full p-3 min-[400px]:p-6 pb-2 text-white'
                id="country-select-demo"
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                    />
                    {option.label} ({option.code}) + {option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by country"
                    style={{
                      backgroundColor: '#ffffff',
                    }}
                    inputProps={{
                      ...params.inputProps,               
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
                onChange={(e, inputValue) => {
                  if(inputValue){
                    const country = inputValue.label.toLowerCase().split(" ").join("_");
                    let copy = searchParams;
                    copy.set('mode', 'offline');
                    copy.set('country', country);
                    setSearchParams(copy);  
                  }
                  else{
                    let copy = searchParams;
                    copy.delete('mode');
                    copy.delete('country');
                    setSearchParams(copy);  
                  }
                }}
              />
              
              <div className='w-full flex flex-row justify-center gap-4 mb-4'>
                <button
                  onClick={() => {
                    window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
                  }}
                  className='flex-end rounded h-fit w-fit'
                >
                  <Button 
                    variant="outlined"
                    style={{
                      textTransform: 'none',
                      fontSize: '14.5px',
                      padding: '7px 15px',
                      borderColor: '#C2410C',
                      color: '#C2410C',
                      fontWeight: 'bold',
                      backgroundColor: '#171f2a'
                    }}
                  >
                    Apply
                  </Button>
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/events';
                  }}
                  className='flex-end rounded h-fit w-fit'
                >
                  <Button 
                    variant="contained"
                    style={{
                      textTransform: 'none',
                      fontSize: '14.5px',
                      padding: '7px 15px',
                      backgroundColor: '#C2410C',
                    }}
                  >
                    Reset
                  </Button>
                </button>
              </div>
              
            </List>

          </Collapse>

        </motion.div>
      </List>

    </Box>
    </div>
  );

  return (
    <div className='bg-[#1f2937]'>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onClick={(e) => {
              if(e.clientX <= screenWidth - sheetWidth || (e.clientY >= 20 && e.clientY <= 44 && e.clientX >= screenWidth - 34 && e.clientX <= screenWidth - 10)) setIsOpen(false);
            }}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default TemporaryDrawer;