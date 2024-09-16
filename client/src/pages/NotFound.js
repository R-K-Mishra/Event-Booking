import React from 'react';
import { useEffect } from 'react'; 
import { useLoadingContext } from '../hooks/useLoadingContext';
import { notfoundUrl } from '../constants';
import { Link } from 'react-router-dom';

const NotFound = () => {
    const { loadingDispatch } = useLoadingContext();
    useEffect(() => {
        loadingDispatch({ type: 'RESET' });
    }, []);

    return (
        <div className="min-h-screen w-full max-w-[2000px] bg-[#f1f5f9] flex flex-col items-center justify-center mt-12">
            <img src={notfoundUrl} alt='Error 404 Not Found.' className='w-full sm:w-1/2 mb-8' />
            <Link to='/' >
                <button className='primary-btn rounded font-medium p-2'> Back to Home </button>    
            </Link>
        </div>
    );
}
 
export default NotFound;