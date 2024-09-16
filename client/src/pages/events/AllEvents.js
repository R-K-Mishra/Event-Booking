import * as React from 'react';
import { SERVER_DOMAIN } from '../../constants/index';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TablePagination from '@mui/material/TablePagination';
import { paginationTheme } from '../../constants';

import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEventContext } from '../../hooks/useEventContext';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { animate, easeInOut, easeOut, motion, spring } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa6";

import { loading2Url, pageTitle } from '../../constants/index';

import EventCard from '../../components/EventCard';
import EventSidebar from '../../components/sidebar/EventSidebar';

const AllEvents = () => {

    const { loadingDispatch } = useLoadingContext();
    // const { events, dispatch } = useEventContext();
    const [events, setEvents] = useState(null);

    const [count, setCount] = useState(0);
    
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const [search, setSearch] = useState(searchParams.get('q') || '');

    const searchInput = searchParams.get('q') || '';
    const sortInput = searchParams.get('sort_by') || '';
    const pageInput = searchParams.get('page') || 1;
    const limitInput = searchParams.get('limit') || (window.screen.width < 1024 ? 6 : 8);
    const countryInput = searchParams.get('country');
    const modeInput = searchParams.get('mode');

    const navigate = useNavigate();

    const getEvents = async () => {
            
        const response = await fetch(`${SERVER_DOMAIN}/events?q=${searchInput}&sort=${sortInput}&pageNumber=${Math.max(pageInput, 1)}&pageLimit=${Math.max(limitInput, 1)}&${countryInput && `country=${countryInput}`}&${modeInput && `mode=${modeInput}`}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
        });
        
        const data = await response.json();
        // console.log(data);
        setEvents(data.events);
        setCount(data.count);

        const maxPage = Math.ceil(data.count / limitInput);
        if(pageInput > maxPage){
            searchParams.set('page', maxPage);
            window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
        }
        
        // localStorage.setItem('events', JSON.stringify(data));
        // dispatch({ type: 'SET_EVENTS', payload: data.events });
    }
    
    useEffect(() => {
        
        getEvents();

        document.title = pageTitle.events;

        loadingDispatch({ type: 'RESET' });
        
    }, []);
    
    const [showFilter, setShowFilter] = useState(false);

    const handleSearch = (search) => {
        if(search){
            searchParams.set('q', search);
            searchParams.delete('page');
        } 
        else{
            if(!searchParams.get('q')) return;
            searchParams.delete('q');
        } 
        window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
    };

    const FilterRef = useRef(null);

    useEffect(() => {
        const handleClickOutsideFilter = (event) => {
          if (FilterRef.current && !FilterRef.current.contains(event.target)) {
            // Clicked outside the target element
            setShowFilter(false);
          }
        };
    
        // Attach the event listener to the document when the component mounts
        document.addEventListener('mousedown', handleClickOutsideFilter);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', handleClickOutsideFilter);
        };
    
    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    return (

        <div className="mt-28 sm:mt-40 lg:mt-44 mb-24 sm:mb-40 md:mb-32 mx-[40px] md:mx-[50px] lg:mx-[60px] ">

            <div className='flex flex-row justify-center items-center mb-12 sm:mb-20'>   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative w-full sm:w-2/3 xl:w-1/3">
                    <Tooltip title="Click here to search" arrow TransitionComponent={Zoom} className='absolute inset-y-0 left-0 flex items-center h-12 px-[14px] bg-[#383838] rounded'>
                        <button
                            class="absolute inset-y-0 left-0 flex items-center h-12 px-[14px] bg-[#383838] rounded"
                            onClick={() => handleSearch(search)}
                        >
                            <svg class="w-4 h-4 text-[#0015ff] dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </button>    
                    </Tooltip>
                    <Tooltip title='Type here to search'  arrow TransitionComponent={Zoom} className='bg-[#1f2937] block w-full h-12 p-4 pl-16 text-sm text-white border border-gray-400 rounded focus:ring-[#0015ff] focus:border-[#0015ff] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#0015ff] dark:focus:border-[#0015ff] hover:shadow-lg hover:shadow-gray-300'>
                        <input
                            type="text" class="bg-[#1f2937] block w-full h-12 p-4 pl-16 text-sm text-white border border-gray-400 rounded focus:ring-[#0015ff] focus:border-[#0015ff] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#0015ff] dark:focus:border-[#0015ff] hover:shadow-lg hover:shadow-gray-300" placeholder="Search Events" required
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Tooltip>
                    <Tooltip title='Filter Events' arrow TransitionComponent={Zoom} className='hidden sm:flex absolute inset-y-0 right-4 items-center'>
                        <button 
                            className='hidden sm:flex absolute inset-y-0 right-4 items-center'
                            onClick={() => setShowFilter(!showFilter)}
                        > 
                            <TuneIcon className='text-gray-300 scale-90'/>
                        </button>    
                    </Tooltip>
                    
                    <button 
                        className={`${!search && 'hidden'} flex absolute inset-y-0 right-4 sm:right-12 items-center`}
                        onClick={() => setSearch('')}
                    > 
                        <CloseIcon className='text-gray-300'/>
                    </button>
                </div>
            </div>

            {
                events === null ? 

                <div className='w-full h-[50vh] flex items-center justify-center'>
                    <img src={loading2Url} alt='Loading...' className='w-20 h-20' /> 
                </div>
                    
                    :

            <div>

            
            {events.length === 0 && 
                <div className='flex flex-row justify-center items-center mt-40 mb-32'>
                    <h1 className='font-semibold sm:text-lg'> No events found. Please adjust your filters and try again. </h1> 
                </div>
            }

            <div className='w-full h-full flex flex-row justify-center items-center'>

                <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 sm:gap-7 md:gap-[27px] lg:gap-[32px] max-w-[2000px] ' >

                    {events.map((event, index) => (
                        <motion.div 
                            className='hover:shadow-2xl hover:shadow-gray-300' 
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    y: 100
                                },
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        type: spring,
                                        duration: 1,
                                        delay: 0.1 * index,
                                        ease: easeInOut
                                    }
                                }
                            }}
                            initial='hidden'
                            animate='show'
                        >

                            <EventCard event={event} />

                        </motion.div>
                    ))}

                </div>
                
            </div>

            {
                showFilter && <EventSidebar showFilter={showFilter} setShowFilter={setShowFilter} />
            }

            <div className={`w-full flex justify-center ${events === null ? 'hidden' : ''}`}>

                <ThemeProvider theme={paginationTheme}>

                    <TablePagination
                        className='mt-28'
                        component="div"
                        count={count}
                        page={Number(pageInput - 1)}
                        onPageChange={(e, page) => {
                            if(page > 0) searchParams.set('page', page + 1);
                            else searchParams.delete('page'); 
                            window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
                        }}
                        rowsPerPage={Number(limitInput)}
                        labelRowsPerPage='Events per page'
                        onRowsPerPageChange={(e) => {
                            if(e.target.value > 0) searchParams.set('limit', e.target.value);
                            else searchParams.delete('limit');
                            window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
                        }}
                        rowsPerPageOptions={[...(Array.from({ length: count }, (_, index) => index + 1)), { value: count, label: 'All' }]}
                        showFirstButton={true}
                        showLastButton={true}
                    />

                </ThemeProvider>

            </div>

            </div>
            
            }

        </div>

    );
}
 
export default AllEvents;