
import { SERVER_DOMAIN } from '../../constants/index';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Carousel, Card } from 'flowbite-react'; 
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEventContext } from '../../hooks/useEventContext';
import { useLoadingContext } from '../../hooks/useLoadingContext'; 
import ShareIcon from '@mui/icons-material/Share';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SaveIcon from '@mui/icons-material/Save';
import 'react-toastify/dist/ReactToastify.css';
import { DateConverterEventCard, DateConverterEventPage } from '../../components/DateConverter';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import RoomIcon from '@mui/icons-material/Room';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';

import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const defaultEventImg = 'https://firebasestorage.googleapis.com/v0/b/ticketvibe.appspot.com/o/default-event.png?alt=media&token=8a1f88f7-1a9e-4b5c-8ac4-4bd5817e0f02';

const Event = () => {

    const [event, setEvent] = useState('');
    const [errors, setErrors] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const navigate = useNavigate();

    const { id } = useParams();

    const { signedin, user } = useAuthContext();
    const { loadingDispatch } = useLoadingContext();

    const [fileUpload, setFileUpload] = useState(false);
    const [fullDescription, setFullDescription] = useState(false);

    const images = [
        {
            id: 1,
            src: (event?.images && event?.images[0]) || defaultEventImg,
            alt: "Image1"
        },
        {
            id: 2,
            src: (event?.images && event?.images[1]) || defaultEventImg,
            alt: "Image2"
        },
        {
            id: 3,
            src: (event?.images && event?.images[2]) || defaultEventImg,
            alt: "Image3"
        },
        {
            id: 4,
            src: (event?.images && event?.images[3]) || defaultEventImg,
            alt: "Image4"
        },
        {
            id: 5,
            src: (event?.images && event?.images[4]) || defaultEventImg,
            alt: "Image5"
        },
    ];

    useEffect(() => {

        loadingDispatch({ type: 'LOADING' });

        const fetchEvent = async () => {

            const response = await fetch(`${SERVER_DOMAIN}/events/${id}`);

            const data = await response.json();

            loadingDispatch({ type: 'RESET' });

            if(data.errors){
                setErrors(data.errors);
            }
            else{
                setEvent(data.event);
                document.title = data.event.title;
            }

        }   
        
        fetchEvent();

    }, []);
    
    useEffect(() => {
        if (signedin) {
          setUserDetails(user.user);
        }
    }, [signedin, user]);

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    const handleBook = async (e) => {

        e.preventDefault();

        if (!signedin) {
            searchParams.set('redirect_uri', currentUrl);
            searchParams.set('action', 'book_event');
            window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
            return;
        }

        const token = JSON.parse(localStorage.getItem('userToken'))?.token;
       
        const response = await fetch(`${SERVER_DOMAIN}/events/book?eventId=${id}`, {
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();

        if (data.errors) {
            
        }
        else {
            alert('Event Ticket Booked Successfully');
        }

    }

    return (

        <div className='flex flex-row justify-center'>
        
        <div className="max-w-[2000px] mt-12 mb-20 mx-[30px] md:mx-0 min-h-[100vh] "> 

            {event && 

                <div className='w-full flex flex-col items-center justify-evenly'> 
                    <Carousel 
                        slideInterval={3000} 
                        slide={!fileUpload}
                        className='w-full md:mx-0 sm:w-5/6 md:w-3/4 min-[350px]:h-[325px] min-[400px]:h-[350px] min-[450px]:h-[400px] sm:h-[450px] mt-12 mb-28'
                    >
                        {
                            images.map((image, index) => (
                                <div 
                                    key={image.id}
                                    style={{
                                        background: `url(${image.src}) no-repeat center center/cover`
                                    }}
                                    className='w-full md:mx-0 min-[350px]:h-[325px] min-[400px]:h-[350px] min-[450px]:h-[400px] sm:h-[450px]'
                                    onMouseEnter={() => {
                                        if(user && user.user._id === event.createdBy._id) setFileUpload(true);
                                    }}
                                    onMouseLeave={() => {
                                        if(fileUpload) setFileUpload(false);
                                    }}
                                >
                                    <div className={`${!fileUpload && 'hidden'} w-full h-full flex items-center justify-center`}>
                                        <Button 
                                            component="label" 
                                            variant="contained" 
                                            startIcon={<CloudUploadIcon />}
                                            style={{
                                                color: 'white',
                                                backgroundColor: '#C2410C',
                                                textTransform: 'none'
                                            }}
                                        >
                                            <p className='ml-2'> Upload file </p> 
                                            <VisuallyHiddenInput type="file" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                    </Carousel>   

                    <div className='w-full sm:w-5/6 md:w-3/4 mb-12 relative'>

                        <div className='flex flex-row items-center gap-4 mb-8 absolute right-0'> 
                            <Tooltip title="Save Event" arrow TransitionComponent={Zoom}>
                                <button
                                    className=''
                                    onClick={() => {
                                        navigator.share({
                                            url: `/event/${id}`
                                        })
                                    }}
                                > 
                                    <div className='flex flex-row items-end gap-6 p-1.5 rounded-full border-[1px] border-transparent hover:border-gray-500' > 
                                        <SaveIcon fontSize='medium' /> 
                                    </div>  
                                </button>     
                            </Tooltip>
                            
                            <Tooltip title="Share Event" arrow TransitionComponent={Zoom}>
                                <button
                                    className=''
                                    onClick={() => {
                                        navigator.share({
                                            url: `/event/${id}`
                                        })
                                    }}
                                > 

                                    <div className='flex flex-row items-end gap-6 p-1.5 rounded-full border-[1px] border-transparent hover:border-gray-500' > 
                                        <ShareIcon fontSize='medium' /> 
                                    </div>  
                                </button>     
                            </Tooltip>
                        </div> 

                        <div className='flex flex-row justify-between mb-12'>
                            <div> <h1 className='text-[45px] font-bold head-black'> {event.title} </h1> </div>   
                        </div> 

                        <div className='mb-10'>
                            <div> <h1 className='text-xl font-semibold mb-6'> Date and Time </h1> </div> 
                            <div className='flex flex-row items-center gap-1 min-[380px]:gap-3 sm:gap-5'> 
                                <EventAvailableIcon /> 
                                <h1 className='font-bold text-[12px] min-[380px]:text-[12.5px] sm:text-[15px] text-orange-500'> 
                                    {DateConverterEventPage(event.start)}
                                </h1> 
                            </div> 
                        </div>
                        
                        <h1 className='text-xl font-semibold mb-4'> About </h1>
                        <div className='flex flex-row justify-between mb-8 w-full sm:w-5/6 lg:w-4/5 text-justify'>
                            
                            <div className='text-sm text-gray-600'> 
                                <div className='text-black text-[15px] mt-2 mb-8 flex flex-row items-center gap-4'> <TimelapseIcon fontSize='medium' /> 1 hour </div>
                                
                                {
                                    !fullDescription ? 

                                    <div>
                                        {event.description.split(" ").slice(0, 50).join(" ")}
                                        <button 
                                            className='text-sm ml-2 text-blue-600'
                                            onClick={() => setFullDescription(true)}
                                        >
                                            Read More...
                                        </button>
                                    </div>
                                    
                                    :

                                    <div>
                                        {event.description}
                                        <button 
                                            className='text-sm ml-2 text-blue-600'
                                            onClick={() => setFullDescription(false)}
                                        >
                                            Read Less...
                                        </button>
                                    </div>
                                }

                                
                            </div> 
                        </div>

                        <div className=''>
                            <div> <h1 className='text-xl font-semibold mb-8'> Venue Details </h1> </div> 

                            {
                                event.mode === 'online' ? 

                                <div className='flex flex-row items-center gap-4 mb-8'> 
                                    <OnlinePredictionIcon /> 
                                    <p className='text-lg'> 
                                        Online 
                                    </p> 
                                </div> 
                                
                                :

                                <div className='flex flex-row gap-6'>

                                    <RoomIcon />

                                    <div className='mb-8'>

                                        <h1 className='font-semibold text-black mb-4 flex flex-row items-center gap-4'> 
                                            <p className='text-[16px]'> {event.venue.name} </p> 
                                        </h1> 
                                        <h3 className='text-sm mb-4 text-black'>
                                            {event.venue.address}, {
                                                event.venue.country.includes('_') ? event.venue.country.split('_').join(' ').charAt(0).toUpperCase() + event.venue.country.split('_').join(' ').slice(1)  : event.venue.country.charAt(0).toUpperCase() + event.venue.country.slice(1)
                                            }
                                        </h3>
                                        <Link 
                                            to={`https://google.com/maps?q=${event.venue.coordinates[0]},${event.venue.coordinates[1]}`} className='text-sm text-blue-600 font-semibold'
                                            target='_blank'
                                        >
                                            Open map
                                        </Link>
                                        
                                    </div>

                                </div>

                            }
                            
                        </div>

                        <div className=''>
                            <div> <h1 className='text-xl font-semibold mb-8'> Bookings </h1> </div> 
                            <div>  
                                <h1 className='text-sm text-grey-500 mb-8 flex flex-row gap-4'> 
                                    Book a ticket before 
                                    <p className='font-semibold text-blue-600'> 
                                        {DateConverterEventCard(event.reg_end)}  
                                    </p> 
                                </h1> 
                            </div> 
                        </div>

                        <div className='flex flex-row gap-4 items-center mb-20'>
                            <div> <h1 className='text-xl font-semibold'> Total Registrations </h1> </div>  <div className='font-semibold text-blue-700 mr-4'> x{!event.bookedBy ? 0 : event.bookedBy.length} </div>   
                            {/* <div> <h1 className='font-normal text-grey-500 mb-20'> Ends on {event.reg_end} </h1> </div>  */}
                        </div>

                        <div className='flex flex-row justify-center'>
                            <button type="button" 
                                className="text-white bg-[#171f2a] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded text-md px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 hover:shadow-md hover:shadow-gray-400"
                                onClick={handleBook}
                                > 
                                    Book a ticket 
                            </button> 
                        </div>

                    </div>

                </div>
                  
            }

            {errors && 
                <div className='container'>
                    <div className='font-bold text-3xl'> { errors } </div>
                </div> 
            }

        </div>

        </div>
    );
}
 
export default Event;