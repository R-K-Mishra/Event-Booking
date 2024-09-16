import * as React from 'react';
import { SERVER_DOMAIN } from '../constants/index';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import { DateConverterEventCard } from './DateConverter';
import EventSave from './dialog/EventSave';
import { useAuthContext } from '../hooks/useAuthContext';

const ShareButton = ({ id, showShare, event, setShowShare }) => {

    const { signedin } = useAuthContext();
    const [openSave, setOpenSave] = useState(false);

    const token = JSON.parse(localStorage.getItem('userToken'))?.token;

    const handleEventSave = async () => {
        const response = await fetch(`${SERVER_DOMAIN}/events/save?eventId=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();

        console.log(data);
    }

    return (
        <>
            <button 
                className={`absolute right-4 top-4 p-2 flex items-center justify-center bg-transparent ${!showShare && 'hidden' } bg-white text-black opacity-80 rounded-full border-[1px] border-white hover:border-gray-500`}
                onClick={(e) => {
                    e.preventDefault();
                    navigator.share({
                        text: `🎉 Exciting News! 🎉 Join us for the [Event Title] happening on [Event Date] at [Venue Name]. 🌟 It promises a day filled with fun, laughter, and memorable moments. 🚀 Don't miss out! RSVP now and share the excitement with friends. See you there! 🎊 #AwesomeEvent #SaveTheDate`,
                        url: `/event/${id}`
                    })
                }}
            > 
                <ShareIcon fontSize='medium' /> 
            </button>

            {
                openSave && <EventSave openSave={openSave} setOpenSave={setOpenSave} event={event} setShowShare={setShowShare} />
            }

            <button 
                className={`absolute right-[70px] top-4 p-2 flex items-center justify-center bg-transparent ${!showShare && 'hidden' } bg-white text-black opacity-80 rounded-full border-[1px] border-white hover:border-gray-500`}
                onClick={() => {
                    if(!signedin) setOpenSave(true);
                    else{
                        handleEventSave();
                    }
                }}
            > 
                <SaveIcon fontSize='medium' /> 
            </button>
        </>
    )
}

const EventCard = ({ event }) => {

    const [showShare, setShowShare] = useState(false);

  return (

    <> 
                        
        <motion.div
            whileHover={{
                scale: 1.005,
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                transition:{
                    duration: 5,
                    type: 'spring',
                    stiffness: 500,
                    ease: 'easeInOut'
                }
            }}
            className='hover:shadow-2xl shadow-[#242424]'
        >
            
        <Card>

            <div 
                // style={{ 
                //     background: `url(https://firebasestorage.googleapis.com/v0/b/ticketvibe.appspot.com/o/events%2Fimages%2Fkrishna-in-autumn-my-artwork-wallpaper-v0-kzr4f5h88wub1-min.png?alt=media&token=222994b9-78ca-4ebd-9184-f3964349fb4f) no-repeat center center/cover` 
                // }} 
                className='h-[200px] hover:opacity-[90%] hover:cursor-default relative'
                onMouseEnter={() => setShowShare(true)}
                onMouseLeave={() => setShowShare(false)}
            >
                <ShareButton
                    id={event._id}
                    showShare={showShare} 
                    setShowShare={setShowShare}
                    event={event}
                />
            </div>

            <Link to={`/event/${event._id}`} target='_blank'>

                <CardContent className='bg-[#292929] text-white hover:bg-[#171f2a]'>
                    <div className='mb-2'>
                        <div className='flex flex-row justify-between mb-1'>
                            <div className='w-full flex text-xl'>
                                {event.title}
                            </div> 

                            <ShareButton id={event._id} />
                        </div>
                        <div className='text-orange-500 text-[14px]'>
                            {DateConverterEventCard(event.start)}
                        </div>
                        {/* <Typography component="div" className='text-blue-500 text-lg'>
                            Book a ticket before {event.reg_end}
                        </Typography>     */}
                    </div>
                    <div className='mb-2'>
                        <div className='text-[12.5px] text-blue-500'>
                            {
                                event.mode === 'offline' ? 
                                    `${event.venue.name}, ${event.venue.address}, ${event.venue.country.includes('_') ? event.venue.country.split('_').join(' ') : event.venue.country}` 
                                    :
                                    'Online'
                            }
                        </div>    
                    </div>
                    <div className='mb-2'>
                        <div className='w-[90%] text-justify text-[12px] leading-4'>
                            {event.description.substring(0, 150) + ' ...'}
                        </div>    
                    </div>
                    <div className=''>
                        <Typography variant="body2">
                            <div className='flex flex-row justify-between'> <p> Total Registered - </p> <p className='text-blue-500'> x {!event.bookedBy ? 0 : event.bookedBy.length} </p> </div>  
                        </Typography>    
                    </div>
                    
                </CardContent>    

            </Link>
            
        </Card>
                        
        </motion.div>

    </>
  )
}

export default EventCard;