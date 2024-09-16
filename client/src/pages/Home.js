import { Carousel } from 'flowbite-react';
import { useEffect } from 'react';
import { easeInOut, motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
import { useLoadingContext } from '../hooks/useLoadingContext';
import { homeCarouselImages } from '../constants';

const Home = () => {

    const { loadingDispatch } = useLoadingContext();

    useEffect(() => {
        loadingDispatch({ type: 'RESET' });
    }, []);

    return (

        <div 
            style={{ background: `url(https://firebasestorage.googleapis.com/v0/b/ticketvibe.appspot.com/o/image.webp?alt=media&token=2ddc0082-6b6d-4bca-9746-a14a6ce54699) no-repeat center center/cover` }} 
            className='flex flex-row justify-center'
        >
        
        <div className="w-full max-w-[2000px] h-full mb-16 ">

            <div className='mt-32 sm:mt-44 md:mt-60 lg:mt-32 xl:mt-24 mx-[20px] min-[500px]:mx-[50px] sm:mx-8 xl:mx-16 2xl:mx-24 min-h-[70vh] sm:min-h-[100vh] text-left grid grid-cols-1 xl:grid-cols-2 gap-4 '>

                <div className='w-fit h-fit mt-8 lg:mt-20 2xl:mt-16' >
                    <div className='min-[350px]:text-[38px] min-[375px]:text-[40px] min-[450px]:text-[45px] sm:text-[48px] md:text-[52px] font-bold leading-[150%] '> <div className='md:flex lg:block gap-4'> <p className='head-orange'> Online </p> <p className=' text-[45px] sm:text-[54px] md:text-[60px] head-blue'> Event Booking </p> </div> <p className='head-orange'> now made simple </p> </div>  

                    <div className='bg-[#0015ff] w-fit h-fit mt-20 rounded hover:shadow-sm hover:shadow-[#cacaca]'>
                        <button 
                            onClick={() => window.location.href = '/events'}
                            className='w-fit h-fit' 
                        >
                            <motion.button
                                className='bg-orange-500 text-lg text-white px-4 py-4 font-semibold rounded hover:text-white hover:border-2'
                                whileHover={{
                                    x: 1.5,
                                    y: -1.5,
                                    transition: {
                                        duration: 0.5,
                                        stiffness: 400,
                                        ease: easeInOut
                                    }
                                }}
                            > 
                                <div className='flex justify-center items-center gap-3'> <p className='head-white'> Book Your Next Event </p>  <FaArrowRight /> </div>  
                            </motion.button>   
                        </button>
                    </div> 
                </div>
                
                <div className='lg:flex lg:justify-end lg:items-start xl:justify-start 2xl:justify-end 2xl:items-start w-full mt-[40px] min-[550px]:mt-16 h-[250px] min-[500px]:h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[60%] xl:mt-0 2xl:mt-16 ' >
                    <Carousel slideInterval={3000} className='' id='home-carousel'>

                        {
                            homeCarouselImages.map(image => (
                                <img 
                                    key={image.id} 
                                    loading='lazy' 
                                    src={image.src} 
                                    alt={image.alt} 
                                />
                            ))
                        }

                    </Carousel>
                </div>

            </div>

        </div>

        </div>

    );
}
 
export default Home;