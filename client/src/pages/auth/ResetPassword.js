
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER_DOMAIN } from '../../constants/index';

const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    const { resetToken } = useParams();

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});
        setStatus('');

        if (password.length >= 6 && password === confirmpassword) {

            const response = await fetch(`${SERVER_DOMAIN}/auth/reset-password/${resetToken}`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if(data.errors){
                setErrors(data.errors);
            }
            else{
                setStatus(data.message);
                setErrors({});
                setPassword('');
                setConfirmPassword('');
                searchParams.set('redirect_uri', '/');
                window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
            }

        }
        else {
            if(password.length < 6){
                setErrors({
                    password: 'Minimum length of Password is 6 characters'
                });
            }
            else{
                setErrors({
                    confirmpassword: `Passwords don't match`
                });
            }
        }
    }

    return (

        <div className="h-fit flex items-center justify-center mt-40 mb-40">

            <form className='rounded relative bg-white p-8 w-[85%] min-[550px]:w-[60%] sm:w-[52%] md:w-[45%] min-[1075px]:w-[32%] xl:w-[27%] 2xl:w-[22%] shadow-2xl shadow-gray-400' onSubmit={handleSubmit}>

                <h1 className='text-center text-2xl font-semibold mb-6'> Reset Password </h1>

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="password" name="floating_password" className="peer primary-input" placeholder=" " required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label for="floating_password" className="peer primary-label"> <div className='flex'> Password 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors.password} </div>
                    </div>
                    
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="password" name="repeat_password" className="peer primary-input" placeholder=" " required 
                            value={confirmpassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label for="floating_repeat_password" className="peer primary-label"> <div className='flex'> Confirm Password 
                        <p className='text-red-500 items-start scale-[90%]'> * </p> </div> </label>
                        <div className='peer-focus:font-medium text-xs text-red-500'> {errors.confirmpassword} </div>
                    </div>

                    {!status && 
                        <div className='flex justify-center'>
                            <button className="w-[110px] primary-btn font-semibold text-[15px] px-5 py-[10px] text-center mt-4">
                                Submit
                            </button> 
                        </div>
                    }

                    {status && <div className='flex justify-center'> <div className='font-bold text-base text-green-500 mt-8'> {status} </div> </div> }

                    {errors.token && <div className='flex justify-center'> <div className='font-bold text-base text-red-500 mt-8'> {errors.token} </div> </div> }

            </form>

        </div>
    );
}
 
export default ResetPassword;