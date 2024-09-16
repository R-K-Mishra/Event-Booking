
import { useState, useEffect } from 'react';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import { SERVER_DOMAIN } from '../../constants/index';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const { loadingDispatch } = useLoadingContext();
    
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    useEffect(() => {
        loadingDispatch({ type: 'RESET' });
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});
        setStatus();

        loadingDispatch({ type: 'LOADING' });

        const response = await fetch(`${SERVER_DOMAIN}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        loadingDispatch({ type: 'RESET' });

        if(data.errors){
            setErrors(data.errors);
        }
        else{
            setStatus(data.message);
            setErrors({});
            setEmail('');
        }
    }

    return (

        <div className="h-fit flex items-center justify-center mt-40 mb-40">

            <form className='rounded relative bg-white p-8 w-[85%] min-[550px]:w-[60%] sm:w-[52%] md:w-[45%] min-[1075px]:w-[32%] xl:w-[27%] 2xl:w-[22%] shadow-2xl shadow-gray-400' onSubmit={handleSubmit}>

                <h1 className='text-center text-2xl font-semibold mb-6'> Forgot Password </h1>

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="email" name="floating_email" id="floating_email" className="peer primary-input" placeholder=" " required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label for="floating_email" className="peer primary-label"> <div className='flex'> Email address 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors.email} </div>
                    </div>

                    <div className='flex justify-center'>
                        <button className="w-[110px] primary-btn font-semibold text-[15px] px-5 py-[10px] text-center mb-4">Submit</button>    
                    </div>
                    
                    {!status && <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300"> Back to <a href="/auth/signin" className="text-blue-600 dark:text-blue-500 ml-1"> Signin </a> </h3>}

                    {status && <div className='font-bold text-base text-green-500 mt-4'> {status} </div>}
                    
            </form>

        </div>
    );
}
 
export default ForgotPassword;