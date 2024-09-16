import React from 'react';
import { Link } from 'react-router-dom';

import { IoLocation } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FaRegCopyright } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { IoIosHome } from "react-icons/io";
import { BiSolidInfoSquare } from "react-icons/bi";
import { MdEvent } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";

const QuickLinks = [
  {
    id: 1,
    path: '/',
    icon: <IoIosHome />,
    title: 'Home'
  },
  {
    id: 2,
    path: '/about',
    icon: <BiSolidInfoSquare />,
    title: 'About'
  },
  {
    id: 3,
    path: '/events',
    icon: <MdEvent />,
    title: 'Events'
  },
  {
    id: 4,
    path: '/events/create',
    icon: <IoCreateOutline />,
    title: 'Create Event'
  },
];

const SocialLinks = [
  {
    id: 1,
    icon: <FaFacebook />,
    path: 'https://facebook.com',
    title: 'Facebook'
  },
  {
    id: 2,
    icon: <FaInstagramSquare />,
    path: 'https://instagram.com',
    title: 'Instagram'
  },
  {
    id: 3,
    icon: <FaTwitter />,
    path: 'https://twitter.com',
    title: 'Twitter'
  },
  {
    id: 4,
    icon: <FaLinkedin />,
    path: 'https://linkedin.com',
    title: 'LinkedIn'
  },
];

const Contacts = [
  {
    id: 1,
    icon: <IoLocation />,
    value: 'India'
  },
  {
    id: 2,
    icon: <IoMdCall />,
    value: '+91 123456789'
  },
  {
    id: 3,
    icon: <MdMail />,
    value: 'abc@example.com'
  },
];

const Footer = () => {

  return (

    <div className='flex flex-row justify-center bg-[#1f2937]'>

    <div className='flex-end w-full max-w-[2000px] mt-8 p-5 pb-8 min-[500px]:p-10 sm:p-16 sm:pt-12 sm:pb-8'>

      <div className='w-fit'>
        <h2 className='text-xl text-orange-500 font-bold py-1'> Ticketvibe </h2>
        <h2 className='text-xl mb-8 h-[2px] bg-gray-500 w-[50%]'>  </h2>  
      </div>
      
        <div className='w-full grid grid-cols-2 md:grid-cols-4 text-white'>

          <div className='text-white flex flex-col items-start mb-8 mr-12' >
            <div className='flex flex-col justify-start'>
              <div className='w-fit'>
                <h2 className='text-xl p-1 pl-0'> About </h2>
                <h2 className='text-xl mb-8 h-[2px] bg-gray-500 w-[50%]'>  </h2>  
              </div>   
              <p className='text-md'>
              Welcome to Ticketvibe. Learn more about us <Link to='/about' className='text-blue-600 hover:underline'>here</Link>.
              </p>
            </div>
          </div>

          <div className='text-white flex flex-col items-start mb-8'>
            <div className='flex flex-col justify-start'>
              <div className='w-fit'>
                <h2 className='text-xl p-1 pl-0'> Quick Links </h2>
                <h2 className='text-xl mb-8 h-[2px] bg-gray-500 w-[50%]'>  </h2>  
              </div>
              {
                QuickLinks.map(link => (
                  <Link key={link.id} to={link.path} className='hover:text-blue-600 hover:underline mb-2 flex items-center gap-2' > {link.icon} {link.title} </Link>
                ))
              }
            </div>
          </div>

          <div className='text-white flex flex-col items-start' >
            <div className='flex flex-col justify-start'>
              <div className='w-fit'>
                <h2 className='text-xl p-1 pl-0'> Social Media </h2>
                <h2 className='text-xl mb-8 h-[2px] bg-gray-500 w-[50%]'>  </h2>  
              </div>
              {
                SocialLinks.map(link => (
                  <Link key={link.id} to={link.path} className='hover:text-blue-600 hover:underline mb-2 flex items-center gap-2' > {link.icon} {link.title} </Link>
                ))
              }  
            </div>
          </div>

          <div className='text-white flex flex-col items-start' >
            <div className='flex flex-col justify-start'>
              <div className='w-fit'>
                <h2 className='text-xl p-1 pl-0'> Contact </h2>
                <h2 className='text-xl mb-8 h-[2px] bg-gray-500 w-[50%]'>  </h2>  
              </div>
              {
                Contacts.map(contact => (
                  <div key={contact.id} className='hover:text-blue-600 mb-2 flex items-center gap-2 ' > {contact.icon}  {contact.value} </div>
                ))
              }  
            </div>
          </div>

        </div>

        <div className='text-white text-sm flex justify-center items-center mt-4'> Copyright <FaRegCopyright className='mx-1' /> 2024 Ticketvibe. All Rights Reserved. </div>
    </div>

    </div>

  )
}

export default Footer;