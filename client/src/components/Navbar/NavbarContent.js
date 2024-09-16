import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { easeInOut, easeOut, motion, spring } from 'framer-motion';
import MobileSidebar from '../sidebar/MobileSidebar';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileDropdown from '../dropdown/ProfileDropdown';

const NavbarLinks = [
    {
      id: 1,
      path: '/',
      title: 'Home'
    },
    {
      id: 2,
      path: '/about',
      title: 'About'
    },
    {
      id: 3,
      path: '/events',
      title: 'Events'
    },
    {
      id: 4,
      path: '/events/create',
      title: 'Create Event'
    },
];

const NavbarContent = ({ isOpen, setIsOpen, navAtTop }) => {

    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState('');

    const { signedin, user, dispatch } = useAuthContext();

    useEffect(() => {
      if (signedin) {
      setUserDetails(user.user);
      }
    }, [signedin, user, dispatch]);

    const [showProfile, setShowProfile] = useState(false);

    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutsideProfile = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            // Clicked outside the target element
            setShowProfile(false);
        }
        };

        // Attach the event listener to the document when the component mounts
        document.addEventListener('mousedown', handleClickOutsideProfile);

        // Clean up the event listener when the component unmounts
        return () => {
        document.removeEventListener('mousedown', handleClickOutsideProfile);
        };

    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    window.onscroll = () => {
        setShowProfile(false);
    };

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    const handleFilter = (sort) => { 
      if(sort) searchParams.set('sort_by', sort);
      else searchParams.delete('sort_by');
      window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
    };

    const [showBar, setShowBar] = useState(false);
    const [i, setI] = useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuId = 'primary-search-account-menu';

    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

  return (

    <>

      <div className='w-[100%] h-[100%] flex items-center relative'>
        <h2 className='absolute left-6 sm:left-4 md:left-12 lg:left-24'>
          <button
            className='text-2xl head-orange'
            onClick={() => {
              if(currentUrl.pathname === '/') window.scrollTo({top: 0, behavior: 'smooth'});
              else window.location.href = '/';
            }}
          >
            Ticketvibe
          </button>
        </h2>

        <ul className='hidden sm:flex mx-auto text-[17px] '>

          {
            NavbarLinks.map((link, index) => (
              <li key={link.id} className='mr-4 md:mr-8 lg:mr-12 hover:text-orange-500' >
                <button 
                  onClick={() => window.location.href = link.path}
                  onMouseEnter={() => {setShowBar(true); setI(index)}}
                  onMouseLeave={() => {setShowBar(false); setI(index)}}
                >
                  <div className='w-full relative'> 
                    {link.title} 
                    <motion.div 
                      className='absolute top-[30px] bg-orange-500 w-full'
                      variants={{
                        hidden: {
                          opacity: 0,
                          width: '25%',
                          height: 2
                        },
                        show: {
                          opacity: 1,
                          width: '100%',
                          height: 2.5,
                          transition: {
                            duration: 0.5
                          }
                        },
                        leave: {
                          opacity: 0,
                          width: '25%',
                          height: 2,
                          transition: {
                            duration: 0.5
                          }
                        }
                      }}
                      initial='hidden'
                      animate={showBar && i === index ? 'show' : 'hidden'}
                      exit={!showBar && i === index ? 'leave' : 'show'}
                    > </motion.div>   
                  </div>
                </button> 
              </li>
            ))
          }

        </ul>  

        {
          signedin ? 

            <div 
              className='absolute right-16 md:right-10 lg:right-16'         
            > 
              <div className='relative'>

              <IconButton
                size="medium"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <img src={userDetails.imgUrl} alt='profile picture' className='w-8 h-8 rounded-full' />
              </IconButton>

              <ProfileDropdown menuId={menuId} anchorEl={anchorEl} setAnchorEl={setAnchorEl} userDetails={userDetails} />

              </div>
              
            </div>  :  

            <div
              className='absolute right-[48px] sm:right-4 lg:right-20'
            >
              <button
                onClick={() => {
                  const currentUrl = new URL(window.location.href);
                  const searchParams = new URLSearchParams(currentUrl.search);
                  if(!searchParams.get('redirect_uri')) searchParams.set('redirect_uri', currentUrl);
                  window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
                }}
                className={`mr-3 primary-btn ${!navAtTop && 'hover:shadow-md hover:shadow-[#0015ff]'} font-medium`}
              >
                <p className='py-[6px] px-[8px]'> SignIn </p> 
              </button>
              <button
                onClick={() => {
                  window.location.href = '/auth/signup';
                }}
                className={`hidden sm:inline sm:mr-3 primary-btn ${!navAtTop && 'hover:shadow-md hover:shadow-[#0015ff]'} font-medium`}
              >
                <p className='py-[6px] px-[8px]'> SignUp </p> 
              </button>
            </div>

        }
      
        <div className='sm:hidden absolute right-0 w-[48px]'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center mx-auto'
          > 
            <MenuIcon className='mx-auto scale-[115%]' fontSize='medium' />
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
              className="w-6 h-6 scale-110">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg> */}
          </button>
        </div>

        {
          isOpen && 
          <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        }

    </div>


    </>
  )
}

export default NavbarContent