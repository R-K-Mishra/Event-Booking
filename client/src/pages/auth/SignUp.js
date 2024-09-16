
import { useState, useEffect } from 'react';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import GoogleSignUpPopup from './GoogleSignUpPopup';
import { SERVER_DOMAIN } from '../../constants/index';

import FileUpload from '../../components/FileUpload';

const SignUp = () => {

    const [formData, setFormData] = useState({
        fname: '', lname: '', email: '', password: '', confirmpassword: '', username: '', dob: ''
    });

    const { loadingDispatch } = useLoadingContext();
    
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const [open, setOpen] = useState(false);

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {

        const handleCheck = () => {
            if(formData.password.length > 0 && formData.confirmpassword.length > 0){
                if(formData.password !== formData.confirmpassword){
                    setErrors({ ...errors, confirmpassword: `Passwords don't match` });
                }
                else{
                    setErrors({ ...errors, confirmpassword: '' });
                }
            }
            else{
                setErrors({});
            }
        }

        document.addEventListener('click', handleCheck);  
    
    }, [formData.password, formData.confirmpassword]);

    useEffect(() => {

        const handleCheck = () => {
            if(formData.password.length > 0 && formData.password.length < 6){
                setErrors({ ...errors, password: 'Minimum length of password is 6 characters' });
            }
            else{
                setErrors({ ...errors, password: '' });
            }
        }

        document.addEventListener('click', handleCheck);  
    
    }, [formData.password]);

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

    useEffect(() => {

        const handleCheck = () => {
            if(formData.fname.length > 0 && formData.fname.length < 4){
                setErrors({ ...errors, fname: 'Minimum length of first name is 4 characters' });
            }
            else{
                setErrors({ ...errors, fname: '' });
            }
        }

        document.addEventListener('click', handleCheck);  
    
    }, [formData.fname]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.password === formData.confirmpassword && formData.password.length >= 6 && formData.username.length >= 4 && formData.fname.length >= 4) {

            loadingDispatch({ type: 'LOADING' });

            const response = await fetch(`${SERVER_DOMAIN}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ 
                    fname: formData.fname, 
                    lname: formData.lname, 
                    username: formData.username, 
                    email: formData.email, 
                    password: formData.password, 
                    dob: formData.dob, 
                    imgUrl: '',
                    token: '',
                    client_id: '',
                    authMode: 'Email' 
                })
            });

            const data = await response.json();

            loadingDispatch({ type: 'RESET' });

            if (data.errors) {
                setErrors(data.errors);
            }
            else {
                setErrors({});
                setFormData({ fname: '', lname: '', email: '', password: '', confirmpassword: '', username: '', dob: '' });
                alert('Please verify your email id through the link sent on your email');
                searchParams.set('redirect_uri', '/');
                navigate(`/auth/signin?${searchParams.toString()}${currentUrl.hash}`);
            }

        }

        else{
            if (formData.fname.length < 4) {
                setErrors({
                    fname: 'Minimum length of first Name is 4 Characters',
                })
            }
            else if (formData.username.length < 4) {
				setErrors({
					username: 'Minimum length of username is 4 characters',
				});
			}
			else if (formData.password.length < 6) {
				setErrors({
					password: 'Minimum length of password is 6 characters',
				});
			}
            else {
				setErrors({
					confirmpassword: `Passwords don't match`,
				});
			}
        }

    }

    const [user, setUser] = useState(null);
    const [response, setResponse] = useState(null);

    const handleCredentialResponse = async (response) => {

        /* global google */

        setResponse(response);
        setUser(jwt_decode(response.credential));

        console.log(jwt_decode(response.credential));

        setOpen(true);
        
    }

    useEffect(() => {

        if(google.accounts){
            google.accounts.id.initialize({
                client_id: '707253678289-0bbj3lbd22h8r8q5bs6d5b2mj7vc2cec.apps.googleusercontent.com',
                callback: handleCredentialResponse,
            });
        
            google.accounts.id.renderButton(
                document.getElementById('signUpDiv'),
                {   
                    type: 'standard', 
                    theme: 'filled_blue', 
                    text: 'signup_with',
                    ux_mode: 'popup', 
                    size: 'large',
                    width: '200'
                }
            );
        }

        loadingDispatch({ type: 'RESET' });
        
    }, []);

    return (

        <>

        {open && 
            <GoogleSignUpPopup 
                open={open} 
                setOpen={setOpen} 
                formData={formData} 
                setFormData={setFormData}
                response={response}
                user={user} 
            />
        } 
        
        <div className="h-fit flex items-center justify-center mt-36 min-[400px]:mt-32 md:mt-28 mb-24"> 
            
            <form className="rounded relative bg-white p-8 w-[85%] min-[550px]:w-[60%] sm:w-[52%] md:w-[45%] min-[1075px]:w-[32%] xl:w-[27%] 2xl:w-[22%] shadow-2xl shadow-gray-400" onSubmit={handleSubmit}>

                <h1 className='text-center text-2xl font-semibold mb-6'> SignUp </h1>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="email" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <label for="floating_email" className="peer primary-label"> <div className='flex'> Email address 
                    <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                    <div className='peer-focus:font-medium text-xs text-red-500'> {errors.email} </div>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="password" name="floating_password" id="floating_password" className="peer primary-input" placeholder=" " required 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <label for="floating_password" className="peer primary-label"> <div className='flex'> Password 
                    <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                    <div className='peer-focus:font-medium text-xs text-red-500'> {errors.password} </div>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="password" name="repeat_password" id="floating_repeat_password" className="peer primary-input" placeholder=" " required 
                        value={formData.confirmpassword}
                        onChange={(e) => setFormData({...formData, confirmpassword: e.target.value})}
                    />
                    <label for="floating_repeat_password" className="peer primary-label"> <div className='flex'> Confirm Password 
                    <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                    <div className='peer-focus:font-medium text-xs text-red-500'> {errors.confirmpassword} </div>
                </div>

                <div className="grid sm:grid-cols-2 sm:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_first_name" id="floating_first_name" className="peer primary-input" placeholder=" " required 
                            value={formData.fname}
                            onChange={(e) => setFormData({...formData, fname: e.target.value})}
                        />
                        <label for="floating_first_name" className="peer primary-label"> <div className='flex'> First Name 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <div className='peer-focus:font-medium text-xs text-red-500 w-32'> {errors.fname} </div>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_last_name" id="floating_last_name" className="peer primary-input" placeholder=" " 
                            value={formData.lname}
                            onChange={(e) => setFormData({...formData, lname: e.target.value})}
                        />
                        <label for="floating_last_name" className="peer primary-label">Last name</label>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 sm:gap-6">

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_phone" id="floating_phone" className="peer primary-input" placeholder=" "   
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        <label for="floating_phone" className="peer primary-label"> <div className='flex'> Username 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <div className='peer-focus:font-medium text-xs text-red-500 w-32'> {errors.username} </div>
                    </div>
                    
                    <div className='relative z-0 w-full mb-6 group'>
                        <input type="date" name='floating_dob' className="peer primary-input" placeholder="Date of Birth" 
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        />
                        <label for='floating_dob' className='peer primary-label'> <div className='flex'> Date of Birth 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                    </div>

                </div>

                {/* <div className="grid grid-cols-1">
                    <div className="relative z-0 w-full mb-6 group">
                        <textarea rows={2} type="text" name="floating_bio" id="floating_phone" className="peer primary-input"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                        <label for="floating_bio" className="peer primary-label"> Bio </label>
                        {
                            bio && bio.length < 3 && <div className='text-red-500 text-[12px]'> Minimum length of bio is 3 characters </div>
                        }
                    </div>
                </div> */}

                {/*  <div className="flex flex-col justify-left w-fit mb-4">
                    <div className='flex flex-row'> <FileUpload image={image} setImage={setImage} /> <p className='text-red-500 items-start scale-[90%]'> * </p> </div> 
                    <p className='text-sm'> {image && image.name} </p>
                </div>*/}

                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                    </div>
                    <label for="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="/" className="text-blue-600 dark:text-blue-500">terms and conditions</a>.</label>
                </div>

                <div className='flex justify-center'>
                    <button className="w-[110px] primary-btn font-semibold text-[15px] px-5 py-[10px] text-center mb-4">Submit</button>    
                </div>

                <div className='w-full flex items-center'> <hr className='h-[2px] w-1/2 bg-[#bebebe]'/> <p className='mx-[5px] text-[12px] text-black'> or </p>  <hr className='h-[2px] w-1/2 bg-[#bebebe]'/></div> 

                <div className='flex justify-center'> <div id='signUpDiv' className='mt-4 mb-5 flex justify-center'>  </div> </div>
                
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300"> Already have an account? <a href="/auth/signin" className="text-blue-600 dark:text-blue-500 ml-1"> Signin </a> </h3>

            </form>
        
        </div>

        </>

    );
}
 
export default SignUp;