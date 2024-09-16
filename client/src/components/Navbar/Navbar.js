import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import NavbarContent from './NavbarContent';
import { easeOut, motion, spring } from 'framer-motion';

const Navbar = ({ isOpen, setIsOpen }) => {
  
  const [navAtTop, setNavAtTop] = useState(true);

  const width = window.screen.width;
  const navbarHeight = (width < 640 ? 80 : 65);

  window.addEventListener('scroll', () => {
    if(window.scrollY > navbarHeight){
      setNavAtTop(false);
    }
    else{
      setNavAtTop(true);
    }
  });

  let offsetLeft;

  const element = document.getElementById('navbar');

  if (element) {
    const rect = element.getBoundingClientRect();
    offsetLeft = rect.left;
  }

  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / scrollHeight) * 100;
      setScrollPercentage(percentage);
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (

    <>

      {
        navAtTop ? 

        <div className='w-full flex flex-row justify-center bg-transparent text-black border-b-2 border-gray-200'>

          <nav className='z-10 w-full max-w-[2000px] h-[80px] sm:h-[65px]' id='navbar' >

            <NavbarContent isOpen={isOpen} setIsOpen={setIsOpen} navAtTop={navAtTop} />

          </nav> 

        </div>

        :

        <div className={`fixed top-0 left-0 z-10 w-full flex flex-col h-fit justify-center bg-[#1f2937]`}>

          <div className={`h-[3.5px] bg-orange-500`} style={{ width: `${scrollPercentage}%` }} />

          <div className={`w-full flex flex-row h-[${navbarHeight}px] justify-center bg-[#1f2937]`}>

            <motion.nav
              variants={{
                hidden: {
                  height: 0
                },
                show: {
                  height: navbarHeight,
                  transition: {
                    type: spring,
                    duration: 0.5,
                    stiffness: 400,
                    ease: easeOut
                  }
                }
              }}
              initial='hidden'
              animate='show'
              className={`ml-[${offsetLeft}px] z-10 w-full bg-[#1f2937] max-w-[2000px] text-white`}
            >
              <motion.button 
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 50
                  },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: spring,
                      duration: 0.5,
                      stiffness: 400,
                      ease: easeOut
                    }
                  }
                }}
                initial='hidden'
                animate='show'
                className={navAtTop ? 'hidden' : 'fixed bottom-8 right-16 opacity-[70%]'} 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              > 
                <FaRegArrowAltCircleUp className='w-[300%] h-[300%] bg-black rounded-full' /> 
              </motion.button>

              <NavbarContent isOpen={isOpen} setIsOpen={setIsOpen} navAtTop={navAtTop} />
              
            </motion.nav>

          </div>  

        </div>

      }

    </>

  )
};

export default Navbar;


