import * as React from 'react';
import { SERVER_DOMAIN, countries } from '../../constants/index';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../../hooks/useEventContext';
import { useLoadingContext } from '../../hooks/useLoadingContext';

const CreateEvent = () => {

    const [mode, setMode] = React.useState('online');

    const [title, setTitle] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventStartInput, setEventStartInput] = useState('');
    const [eventEnd, setEventEnd] = useState('');
    const [eventEndInput, setEventEndInput] = useState('');
    const [regStart, setRegStart] = useState('');
    const [regStartInput, setRegStartInput] = useState('');
    const [regEnd, setRegEnd] = useState('');
    const [regEndInput, setRegEndInput] = useState('');
    const [venue, setVenue] = useState({});
    const [description, setDescription] = useState('');

    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { dispatch } = useEventContext();
    const { loadingDispatch } = useLoadingContext();

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    useEffect(() => {

        const user = localStorage.getItem('userToken');

        if (!user) {
            if(!searchParams.get('redirect_uri')) searchParams.set('redirect_uri', currentUrl);
            dispatch({ type: 'SIGNOUT' });
            window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
        }

        if(!searchParams.get('redirect_uri')){
            searchParams.set('redirect_uri', '/events');
            window.location.href = `/events/create?${searchParams.toString()}${currentUrl.hash}`;
        } 

        loadingDispatch({ type: 'RESET' });

    }, []);

    useEffect(() => {

        const handleCheck = () => {
            if(title.length > 0 && title.length < 6){
                setErrors({ ...errors, title: 'Minimum length of event title is 6 characters' });
            }
            else{
                setErrors({ ...errors, title: '' });
            }
        }

        if(title.length >= 6 || title.length === 0){
            setErrors({ ...errors, title: '' });
        }

        document.addEventListener('click', handleCheck);  
    
    }, [title]);

    useEffect(() => {

        const handleCheck = () => {
            if(venue?.name?.length > 0 && venue?.name?.length < 4){
                setErrors({ ...errors, venue: {...venue, name: 'Minimum length of venue name is 4 characters'} });
            }
            else{
                setErrors({ ...errors, venue: {...venue, name: ''} });
            }
        }

        if(venue?.name?.length >= 4 || venue?.name?.length === 0){
            setErrors({ ...errors, venue: {...venue, name: ''} });
        }

        document.addEventListener('click', handleCheck);  
    
    }, [venue?.name]);

    useEffect(() => {

        const handleCheck = () => {
            if(venue?.address?.length > 0 && venue?.address?.length < 10){
                setErrors({ ...errors, venue: {...venue, address: 'Minimum length of venue address is 10 characters'} });
            }
            else{
                setErrors({ ...errors, venue: {...venue, address: ''} });
            }
        }

        if(venue?.address?.length >= 10 || venue?.address?.length === 0){
            setErrors({ ...errors, venue: {...venue, address: ''} });
        }

        document.addEventListener('click', handleCheck);
    
    }, [venue?.address]);

    useEffect(() => {

        const validateCoordinates = () => {

            if(venue.latitude > 0){

                const isValidLatitude = !isNaN(parseFloat(venue?.latitude)) && isFinite(venue?.latitude);
            
                if (!isValidLatitude) {
                    setErrors({...errors, venue: {...venue, latitude: 'Not a valid latitude' }});
                } else {
                    setErrors({...errors, venue: {...venue, latitude: '' }});
                }    
            }
            
        };

        document.addEventListener('click', validateCoordinates());  
    
    }, [venue?.latitude]);

    useEffect(() => {

        const validateCoordinates = () => {

            if(venue.longitude > 0){

                const isValidLongitude = !isNaN(parseFloat(venue?.longitude)) && isFinite(venue?.longitude);
            
                if (!isValidLongitude) {
                    setErrors({...errors, venue: {...venue, longitude: 'Not a valid latitude' }});
                } else {
                    setErrors({...errors, venue: {...venue, longitude: '' }});
                }    
            }
            
        };

        document.addEventListener('click', validateCoordinates());  
    
    }, [venue?.longitude]);

    useEffect(() => {

        const handleCheck = () => {
            if(description.length > 0 && description.split(" ").length < 15){
                setErrors({ ...errors, description: 'Minimum length of event description is 150 words' });
            }
            else{
                setErrors({ ...errors, description: '' });
            }
        }

        if(description.split(" ").length >= 15 || description.length === 0){
            setErrors({ ...errors, description: '' });
        }

        document.addEventListener('click', handleCheck);  
    
    }, [description]);

    const validateData = () => {

        if(!title || title.length < 6){
            setErrors({ ...errors, title: 'Minimum length of event title is 6 characters' }); return false;
        }

        if(!eventStart){
            setErrors({ ...errors, eventStart: 'Please select a start date' }); return false;
        }

        if(!eventEnd){
            setErrors({ ...errors, eventEnd: 'Please select a end date' }); return false;
        }
        if(eventEnd - eventStart < 60 * 60 * 1000){
            setErrors({ ...errors, eventEnd: 'Minimum event duration is 1 hour' }); return false;
        }

        if(!regStart){
            setErrors({ ...errors, regStart: 'Please select ticket booking start date' }); return false;
        }
        if(eventStart - regStart < 7 * 24 * 60 * 60 * 1000){
            setErrors({ ...errors, regStart: 'Booking should start at least a week before event' }); return false;
        }

        if(!regEnd){
            setErrors({ ...errors, regEnd: 'Please select ticket booking deadline' }); return false;
        }
        if(regEnd - regStart < 24 * 60 * 60 * 1000){
            setErrors({ ...errors, regEnd: 'Booking duration should be at least a day' }); return false;
        }
        if(eventStart - regEnd < 24 * 60 * 60 * 1000){
            setErrors({ ...errors, regEnd: 'Booking should end at least a day before event' }); return false;
        }

        if(mode === 'offline'){
            if(!venue.name || venue.name.length < 4){
                setErrors({ ...errors, venue: {...venue, name: 'Minimum length of venue name is 4 characters'} }); return false;
            }
            if(!venue.address || venue.address.length < 10){
                setErrors({ ...errors, venue: {...venue, address: 'Minimum length of venue address is 10 characters'} }); return false;
            }

            if(!venue.latitude || !(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(venue.latitude))){
                setErrors({...errors, venue: {...venue, latitude: 'Not a valid latitude' }}); return false;
            }
            if(!venue.longitude || !(/^-?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/.test(venue.longitude))){
                setErrors({...errors, venue: {...venue, longitude: 'Not a valid latitude' }}); return false;
            }
        }

        if(!description || description.split(" ").length < 150){
            setErrors({ ...errors, description: 'Minimum length of event description is 150 words' }); return false;
        }

        return true;
    }


    const handleSubmit = async (e) => {

        e.preventDefault();
                        
        const token = JSON.parse(localStorage.getItem('userToken')).token;

        if(!validateData()) return;

        const response = await fetch(`${SERVER_DOMAIN}/events/create`, {
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title, 
                start: eventStart, 
                end: eventEnd, 
                reg_start: regStart, 
                reg_end: regEnd, 
                mode, 
                venue, 
                description 
            })
        });

        const data = await response.json();

        if (data.errors) {
            setErrors(data.errors);
        }
        else {
            setTitle('');
            setEventStart('');
            setEventEnd('');
            setRegStart('');
            setRegEnd('');
            setMode('');
            setVenue({});
            setDescription('');
            setStatus(data.message);
        }

    }  

    return (
        
        <div className="h-fit flex items-center justify-center mt-28 mb-28"> 

            <form className="rounded relative bg-white p-8 w-[85%] min-[550px]:w-[60%] sm:w-[52%] md:w-[50%] min-[1075px]:w-[35%] xl:w-[30%] 2xl:w-[25%] shadow-2xl shadow-gray-400" onSubmit={handleSubmit}>

                <h1 className='text-center text-2xl font-semibold mb-6'> Create Event </h1>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label for="floating_email" className="peer primary-label"> <div className='flex'> Title 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                    <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.title} </div> 
                </div>

                <div className="grid grid-cols-1 gap-6 mb-5"> 

                    <div className='block'>
                        <label className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400"> <div className='flex'> Event Start 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <input type="datetime-local" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-fit pl-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-9 mt-2" placeholder="Event Start" 
                            value={eventStart}
                            onChange={(e) => {
                                setEventStart(e.target.value);
                                const selectedDateTime = new Date(e.target.value);
                                setEventStartInput(selectedDateTime.getTime() + selectedDateTime.getTimezoneOffset() * 60000);
                            }}
                        />
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.eventStart} </div>
                    </div>

                    <div className='block' >
                        <label className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400"> <div className='flex'> Event End 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <input type="datetime-local" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-fit pl-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-9 mt-2"  placeholder="Event End" 
                            value={eventEnd}
                            onChange={(e) => {
                                setEventEnd(e.target.value);
                                const selectedDateTime = new Date(e.target.value);
                                setEventEndInput(selectedDateTime.getTime() + selectedDateTime.getTimezoneOffset() * 60000);
                            }}
                        />
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.eventEnd} </div>
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-6 mb-5"> 

                    <div className='block' >
                        <label className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400"> <div className='flex'> Registration Start 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <input type="datetime-local" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-fit pl-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-9 mt-2" placeholder="Reg Start"  
                            value={regStart}
                            onChange={(e) => {
                                setRegStart(e.target.value);
                                const selectedDateTime = new Date(e.target.value);
                                setRegStartInput(selectedDateTime.getTime() + selectedDateTime.getTimezoneOffset() * 60000);
                            }}
                        />
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.regStart} </div>
                    </div>

                    <div className='block' >
                        <label className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400"> <div className='flex'> Registration End 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <input type="datetime-local" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-fit pl-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-9 mt-2" placeholder="Reg End" 
                            value={regEnd}
                            onChange={(e) => {
                                setRegEnd(e.target.value);
                                const selectedDateTime = new Date(e.target.value);
                                setRegEndInput(selectedDateTime.getTime() + selectedDateTime.getTimezoneOffset() * 60000);
                            }}
                        />
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.regEnd} </div>
                    </div>

                </div>

                <div className="w-full flex flex-row items-center justify-between mb-4">

                    <label for="mode" className='peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400'> <div className='flex'> Mode
                    <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>

                    <select 
                        className='w-[150px] border-gray-400 border-[1px] rounded py-1.5' 
                        name="mode"
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="online"> Online </option>
                        <option value="offline"> Offline </option>
                    </select>
                    
                </div>
                
                {
                    mode === 'offline' &&

                    <div className='flex flex-col gap-2 mb-6'>

                        <label className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 mb-2"> 
                            <div className='flex'> 
                                Venue 
                            </div> 
                        </label> 

                        <div className="relative z-0 w-[90%] mb-6 group ml-4">
                            <input type="text" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                                value={venue.name}
                                onChange={(e) => setVenue({...venue, name: e.target.value })}
                            />
                            <label for="floating_email" className="peer primary-label"> <div className='flex'> Name 
                                <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                            <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.venue?.name} </div>
                        </div>

                        <div className="relative z-0 w-[90%] mb-6 group ml-4">
                            <input type="text" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                                value={venue.address}
                                onChange={(e) => setVenue({...venue, address: e.target.value })}
                            />
                            <label for="floating_email" className="peer primary-label"> <div className='flex'> Address 
                                <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                            <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.venue?.address} </div>
                        </div>

                        <div className='w-[90%] ml-4 flex flex-row gap-6 justify-between'>
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="number" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" "     required 
                                    value={venue?.latitude}
                                    onChange={(e) => setVenue({...venue, latitude: e.target.value })}
                                />
                                <label for="floating_email" className="peer primary-label"> <div className='flex'> Latitude 
                                    <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                                <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.venue?.latitude} </div>
                            </div>
                            <div className="relative z-0 w-full group">
                                <input type="number" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                                    value={venue?.longitude}
                                    onChange={(e) => setVenue({...venue, longitude: e.target.value })}
                                />
                                <label for="floating_email" className="peer primary-label"> <div className='flex'> Longitude 
                                    <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                                <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.venue?.longitude} </div>
                            </div>
                        </div>

                        <Autocomplete
                            className='w-[90%] ml-4'
                            id="country-select-demo"
                            options={countries}
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <img
                                        loading="lazy"
                                        width="20"
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        alt=""
                                    />
                                    {option.label} ({option.code}) + {option.phone}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose a country"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}
                                />
                            )}
                            onChange={(e, inputValue) => {
                                const countryValue = inputValue.label.toLowerCase().split(" ").join("_");
                                setVenue({...venue, country: (!inputValue ? '' : countryValue )});
                            }}
                        />

                    </div>

                }

                <div className="relative z-0 w-full mb-6 group">
                    <textarea name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label for="floating_email" className="peer primary-label"> <div className='flex'> Description 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                    <div className='peer-focus:font-medium text-xs text-red-500'> {errors?.description} </div>
                </div>
                
                {/* <div className='relative z-0 w-full mb-6 group'>
                    <div className='flex'>
                        <FileUpload image={image} setImage={setImage} />
                        <p className='text-red-500 items-start scale-[90%]'> * </p>    
                    </div>
                    <p className='text-sm'> {image && image.name} </p>
                </div> */}

                <div className='flex justify-center'>
                    <button className="w-[110px] primary-btn font-semibold text-[15px] px-5 py-[10px] text-center mb-4">Submit</button>    
                </div>

                {status}
                {errors.token && <div className='flex justify-center'> <div className='font-bold text-base text-red-500 mt-8'> {errors.token} </div> </div> }

            </form>

        </div>
    );
}
 
export default CreateEvent;