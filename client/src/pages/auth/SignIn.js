
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import { SERVER_DOMAIN } from '../../constants/index';

const SignIn = () => {

    const [formData, setFormData] = useState({
        email: '', password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { dispatch } = useAuthContext();
    const { loadingDispatch } = useLoadingContext();

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        loadingDispatch({ type: 'LOADING' });
        
        const response = await fetch(`${SERVER_DOMAIN}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ 
                authMode: 'Email', 
                usernameOrEmail: formData.email, 
                password: formData.password,
                authToken: '',
                client_id: '' 
            })
        });
        
        const data = await response.json();

        loadingDispatch({ type: 'RESET' });

        if (data.errors) {
            setErrors(data.errors);
        }
        else {

            setErrors({});
            setFormData({ email: '', password: '' });

            console.log(data);
            console.log(JSON.stringify(data));

            dispatch({ type: 'SIGNIN', payload: data });
            localStorage.setItem('userToken', JSON.stringify(data));

            window.location.href = searchParams.get('redirect_url') || '/';
        }
    }

    const handleCredentialResponse = async (response) => {

        /* global google */
    
        let userObject = jwt_decode(response.credential);

        console.log(userObject);

        loadingDispatch({ type: 'LOADING' });
    
        const res = await fetch(`${SERVER_DOMAIN}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ 
                authMode: 'Google',
                usernameOrEmail: userObject.email,
                password: '',
                authToken: response.credential, 
                client_id: '707253678289-0bbj3lbd22h8r8q5bs6d5b2mj7vc2cec.apps.googleusercontent.com'  
            })
        });

        const data = await res.json();

        loadingDispatch({ type: 'RESET' });

        if (data.errors) {
            setErrors(data.errors);
        }
        else {
            setErrors({});
            setFormData({ email: '', password: '' });

            console.log(data);
            console.log(JSON.stringify(data));

            dispatch({ type: 'SIGNIN', payload: data });
            localStorage.setItem('userToken', JSON.stringify(data));

            window.location.href = searchParams.get('redirect_url') || '/';
        }
    }
          
    useEffect(() => {

        if(google.accounts){
            google.accounts.id.initialize({
                client_id: '707253678289-0bbj3lbd22h8r8q5bs6d5b2mj7vc2cec.apps.googleusercontent.com',
                callback: handleCredentialResponse,
            });
        
            google.accounts.id.renderButton(
                document.getElementById('signInDiv'),
                {   
                    type: 'standard', 
                    theme: 'filled_blue', 
                    text: 'signin_with',
                    ux_mode: 'popup', 
                    size: 'large',
                    width: '200',
                }
            );

            google.accounts.id.prompt();    
        }

        loadingDispatch({ type: 'RESET' });

    }, []);

    return (

        <div className="h-fit flex items-center justify-center mt-32 mb-32"> 
            
            <form className='rounded relative bg-white p-8 w-[85%] min-[550px]:w-[60%] sm:w-[52%] md:w-[45%] min-[1075px]:w-[32%] xl:w-[27%] 2xl:w-[22%] shadow-2xl shadow-gray-400' onSubmit={handleSubmit}>

                <h1 className='text-center text-2xl font-semibold mb-6'> SignIn </h1>

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <label for="floating_email" className="peer primary-label"> <div className='flex'> Username or Email 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors.username} </div>
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
                    
                    <a href="/auth/forgot-password" className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-500">Forgot Password?</a>

                    <div className="flex items-start mb-6 mt-5">
                        <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                        </div>
                        <label for="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                    </div>

                    <div className='flex justify-center'>
                        <button className="w-[110px] primary-btn font-semibold text-[15px] px-5 py-[10px] text-center mb-4">Submit</button>    
                    </div>    

                    <div className='w-full flex items-center'> <hr className='h-[2px] w-1/2 bg-[#bebebe]'/> <p className='mx-[5px] text-[12px] text-black'> or </p>  <hr className='h-[2px] w-1/2 bg-[#bebebe]'/></div>

                    <div className='flex justify-center'> <div id='signInDiv' data-auto_select="true" className='mt-4 mb-5 flex justify-center'>  </div> </div> 

                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300"> Don't have an account? <a href="/auth/signup" className="text-blue-600 dark:text-blue-500 ml-1"> Signup </a> </h3>

            </form>

        </div>
    );
}
 
export default SignIn;