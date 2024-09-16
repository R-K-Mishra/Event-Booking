import React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom';

const UserEvents = () => {

  const { signedin, user } = useAuthContext();

  const organizedEvents = user.user.events;

  return (
    <div className='mt-36 mb-20 mx-4 min-[500px]:mx-8 md:mx-20 flex justify-center items-center h-fit'>
      <div className='flex flex-col justify-center items-center w-full h-full'>
        <h1 className='text-left text-2xl text-black font-bold mb-8'> Events organized by you </h1>
        <div className='w-full sm:w-5/6 lg:w-3/4 max-w-6xl h-fit primary-bg text-white py-4 rounded'>
          {
            organizedEvents.map((event) => (
              <Link 
                to={`/event/${event._id}`} 
                className='w-fit h-fit  '
              >
                <div key={event._id} className='w-full p-4 flex flex-col justify-center border-t-[1px] border-gray-500 hover:bg-gray-900'>
                  <p className='text-lg font-semibold text-white mb-2'> {event.title} </p>
                  <p className='text-md font-medium text-white mb-1'> {event.start} </p>
                  <p className='text-sm font-normal text-white'> {event.venue} </p>
                </div>  
              </Link> 
              
            ))
          }
        </div>  

        <h1 className='text-left text-2xl text-black font-bold mt-24 mb-8'> Events booked by you </h1>
        <div className='w-full sm:w-5/6 lg:w-3/4 max-w-6xl h-fit primary-bg text-white py-4 rounded'>
          {
            organizedEvents.map((event) => (
              <Link 
                to={`/event/${event._id}`} 
                className='w-fit h-fit  '
              >
                <div key={event._id} className='w-full p-4 flex flex-col justify-center border-t-[1px] border-gray-500 hover:bg-gray-900'>
                  <p className='text-lg font-semibold text-white mb-2'> {event.title} </p>
                  <p className='text-md font-medium text-white mb-1'> {event.start} </p>
                  <p className='text-sm font-normal text-white'> {event.venue} </p>
                </div>  
              </Link> 
              
            ))
          }
        </div>  
      </div>
      
    </div>
  )
}

export default UserEvents;