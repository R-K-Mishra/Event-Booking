import * as React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Menu from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ menuId, anchorEl, setAnchorEl, userDetails }) => {
  const navigate = useNavigate();

  const { dispatch } = useAuthContext();

  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  const handleSignout = async () => {
    localStorage.removeItem('userToken');
    dispatch({ type: 'SIGNOUT' });
    searchParams.set('redirect_uri', currentUrl);
    for (const key of searchParams.keys()) {
      if(key !== 'redirect_uri') searchParams.delete(key);
    }
    window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
    window.location.reload();
  }

  const menuItems = [
    {
      id: 1,
      title: 'Profile',
      icon: <AccountCircleIcon fontSize='small' />,
      url: `/profile/${userDetails.username}`,
    },
    {
      id: 2,
      title: 'My Events',
      icon: <EventIcon fontSize='small' />,
      url: `/events/my`
    },
    {
      id: 3,
      title: 'Settings',
      icon: <SettingsIcon fontSize='small' />,
      url: `/events/my`
    },
  ];

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <div className='bg-blue-600 w-full h-[4px] pt-0'>  </div> */}
      <div className='w-[200px] h-full primary-bg'>

        <div className='w-full text-white tracking-wider text-md font-bold py-4 px-4'>
          {userDetails.username}
        </div>

        {
          menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleMenuClose();
                window.location.href = item.url;
              }}
              className={`w-full px-4 py-3 text-white text-sm font-normal flex justify-start items-center tracking-widest border-t-[1px] border-gray-600 hover:border-gray-500 hover:bg-gray-900 hover:opacity-[80%] `}
            > 
              <div className='flex flex-row items-center gap-3'> {item.icon} {item.title} </div> 
            </button>
          ))
        }

        <div className='h-5 flex items-center'>
          <div className='w-full h-[0.5px] bg-gray-600'> </div>
        </div>

        <button
          onClick={() => {
            handleMenuClose();
            handleSignout();
          }}
          className={`w-full px-4 py-[11px] text-white text-md font-normal flex justify-start items-center tracking-widest hover:opacity-[80%] bg-red-700 hover:bg-red-800`}
        > 
          <div className='flex flex-row items-center gap-3 text-white font-bold'> <LogoutIcon fontSize='small' /> <p className='text-sm'> Sign Out </p> </div> 
        </button>
  
      </div>

    </Menu>  
  )
}

export default ProfileDropdown;