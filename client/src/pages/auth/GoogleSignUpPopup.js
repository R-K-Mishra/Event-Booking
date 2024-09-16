import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { SERVER_DOMAIN } from '../../constants/index';

export default function GoogleSignUpPopup({ open, setOpen, formData, setFormData, user, response }) {

    const [errors, setErrors] = useState({
        username: '', dob: ''
    });

    const [status, setStatus] = useState('');
    const { loadingDispatch } = useLoadingContext();

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    useEffect(() => {

        const handleCheck = () => {
            if(formData.username.length > 0 && formData.username.length < 4){
                setErrors({ ...errors, username: 'Minimum length of username is 4 characters' });
            }
            else{
                setErrors({ ...errors, username: '' });
            }
        }

        document.addEventListener('click', handleCheck);  
    
    }, [formData.username]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(status !== 'pending' && formData.username.length >= 4 && formData.dob){

            setStatus('pending');

            const res = await fetch(`${SERVER_DOMAIN}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ 
                    fname: user.name,
                    lname: '',
                    username: formData.username,
                    email: user.email,
                    password: '',
                    dob: formData.dob,
                    imgUrl: user.picture,
                    token: response.credential, 
                    client_id: '707253678289-0bbj3lbd22h8r8q5bs6d5b2mj7vc2cec.apps.googleusercontent.com',
                    authMode: 'Google'  
                })
            });

            const data = await res.json();

            setStatus('');

            if(data.errors){
                setErrors(data.errors);
                console.log(data.errors);
                // alert(data.errors);
                // if(data.errors === 'This account is already registered. Please signin now') navigate('/auth/signin');
                return;
            }
            
            // alert(data.message);
            searchParams.set('redirect_uri', '/');
            window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;    

        }
        else{
            if(status === 'pending') return;
            if(formData.username.length < 4){
                setErrors({ ...errors, username: 'Minimum length of username is 4 characters' });
            }
            else{
                setErrors({ ...errors, dob: 'Required Field' });
            }
        }
           
    }

    const [scroll, setScroll] = useState('paper');

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <React.Fragment>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >


            <div className='bg-[#1f2937] text-white px-1 sm:px-16'>

                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                
                </DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                        backgroundColor: '#1f2937',
                        '&:hover' : {
                        backgroundColor: '#374151'
                    }
                        // color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography gutterBottom>
                    <p className='text-[12px] md:text-[15px] lg:text-[17px] xl:text-[18px] font-bold text-orange-500 w-full text-center mt-6'> Please provide a few more details to continue</p>
                </Typography>

                <DialogContent className='mt-6 p-2 sm:p-4 shadow-[#121821] shadow-lg bg-[#171f2a]'>

                    <div className="mt-5 grid sm:grid-cols-1 sm:gap-6">

                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" name="floating_phone" id="floating_phone" className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent peer border-0 border-b-2 border-${errors.username ? 'red-500' : 'gray-300'} appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600`} placeholder=""   
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                            <label for="floating_phone" className={`peer peer-focus:font-medium absolute text-sm text-[#eeeeee] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:top-[6px] -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}> 
                            <div className='flex'> Username <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                            <div className='peer-focus:font-medium text-xs text-red-500 w-full'> {errors.username} </div>
                        </div>
                        
                        <div className='relative z-0 w-full mb-6 group'>
                            <input type="date" name='floating_dob' className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-${errors.dob ? 'red-500' : 'gray-300'} appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600`} placeholder="Date of Birth" 
                                value={formData.dob}
                                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                style={{
                                    color: 'white', // Text color of the selected date
                                    '::placeholder': { color: 'white' }, // Placeholder text color
                                    filter: 'brightness(0) invert(1)', // Adjust the icon color to white
                                }}
                            />
                            <label for='floating_dob' className='peer peer-focus:font-medium absolute text-sm text-[#eeeeee] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:top-[6px] -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'> 
                            <div className='flex'> Date of Birth <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                            <div className='peer-focus:font-medium text-xs text-red-500 w-full'> {errors.dob} </div>
                        </div>

                    </div>
                
                </DialogContent>

                <DialogActions className='h-20 mt-2 mb-2'>

                    <div className='w-full h-fit flex flex-row items-center justify-center'>
                        {
                            status === 'pending' ? 

                            <Button
                                style={{
                                    textTransform: 'none',
                                    fontSize: '14.5px',
                                    padding: '0 25px',
                                    backgroundColor: '#C2410C',
                                }}
                                variant="contained"
                                className='h-[42px]'
                            >
                                Processing...
                            </Button>

                            :

                            <Button 
                                style={{
                                    textTransform: 'none',
                                    fontSize: '14.5px',
                                    padding: '0 25px',
                                    backgroundColor: '#C2410C',
                                }}
                                variant="contained"
                                onClick={handleSubmit}
                                className='h-[42px]'
                            >
                                Continue
                            </Button>      

                        }
                    </div>

                </DialogActions>

                <div className={`${!errors.email && 'hidden'} peer-focus:font-medium text-[14px] text-red-500 w-full flex flex-row justify-center mb-2 sm:mb-6`}> {errors.email}. 
                    Please signin 
                    <button
                        onClick={() => {
                            searchParams.set('redirect_uri', '/');
                            window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
                        }}
                        className='ml-1 text-blue-600 hover:underline'
                    >
                        here
                    </button>.
                </div>

            </div>


        </Dialog>
        </React.Fragment>
    );
}