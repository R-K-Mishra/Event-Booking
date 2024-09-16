import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLoadingContext } from '../../hooks/useLoadingContext';

const Profile = () => {

    const [userDetails, setUserDetails] = useState({});

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('');

    const { signedin, user, dispatch } = useAuthContext();
    const { loadingDispatch } = useLoadingContext();
    
    useEffect(() => {
        if (signedin) {
          setUserDetails(user.user);
          setFname(user.user.fname);
          setLname(user.user.lname);
          setEmail(user.user.email);
          setUsername(user.user.username);
          setDob(user.user.dob);
        }
        loadingDispatch({ type: 'RESET' });
    }, [signedin, user, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if(fname != userDetails.fname || lname != userDetails.lname || email != userDetails.email || )
        

    }

    const [profilePicture, setProfilePicture] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [editProfilePicture, setEditProfilePicture] = useState(false);
    const profilePictureRef = useRef(null);

    const handleProfileImageChange = (e) => {
        e.preventDefault();
        setProfilePicture(e.target.files[0]);
        setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }


    return (
        
        <div className='h-[100vh] mt-16 lg:mx-12 xl:mx-24 border-2 border-red-500 flex justify-center'>

            <div className='w-full grid lg:grid-cols-6 gap-4 max-w-[2000px] border-2 border-green-500'>

                <div className='col-span-2 flex flex-col p-4 border-r-2 border-orange-500'>

                    <div className='mt-12 w-full'>

                        <div 
                            className='relative mx-auto h-fit w-fit'
                            onMouseEnter={() => setEditProfilePicture(true)}
                            onMouseLeave={() => setEditProfilePicture(false)}
                        >
                            <img 
                                src={currentImage || userDetails.imgUrl} 
                                alt='Profile Picture' 
                                className='w-[150px] h-[150px] rounded-full hover:cursor-pointer'
                            />

                            <button 
                                className={`${!editProfilePicture && 'hidden'} absolute bottom-0 left-0 right-0 h-[100%] z-20 rounded-full bg-gray-500 opacity-[35%] `} 
                                onClick={() => {
                                    setEditProfilePicture(false);
                                    profilePictureRef.current.click();
                                }}
                            >
                                <div className='w-full h-[50%] flex flex-row justify-center items-center text-white'>
                                    Edit
                                </div>
                            </button>    
                        </div>

                        

                        <input 
                            type='file' 
                            ref={profilePictureRef}
                            className='hidden'
                            onChange={handleProfileImageChange}
                        />

                    </div>

                </div>


                <div className='col-span-4 p-8'>

                    <h1 className='text-xl font-bold'> {userDetails.fname} {userDetails.lname} </h1>



                    <button>  </button>
                    
                </div>

            </div>

        </div>

    );
}
 
export default Profile;