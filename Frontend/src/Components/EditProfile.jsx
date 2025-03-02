import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios';
import { profileDataStructure } from '../Pages/Profile';
import AnimationWrapper from '../Common/AnimationWrapper';
import Loader from './Loader';
import { Toaster } from 'react-hot-toast';
import InputBox from './InputBox';

const EditProfile = () => {
  let {userAuth,userAuth:{access_token}}=useContext(UserContext);
  
  const [profile,setProfile]=useState(profileDataStructure);
  const [loading,setLoading]=useState(true);
  let {personal_info:{fullname,username:profile_username,profile_img,email,bio},social_links}=profile;
  useEffect(()=>{
    if(access_token){
        axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"get-profile",{username:userAuth.username})
        .then(({data})=>{
            setProfile(data);
            setLoading(false);
        })

    }
  },[access_token])
  return (
    <AnimationWrapper>
        {
            loading?<Loader/>:
            <form>
                <Toaster/>
                <h1 className='max-md:hidden'>Edit Profile</h1>
                <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10 '>
                    <div className='max-lg:center mb-5'>
                        <label htmlFor='uploadImg' id='profileImgLabel' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                            <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>Upload Image</div>
                            <img src={profile_img}/>
                        </label>
                        <input type='file' id='uploadImg' accept='.jpeg, .png, .jpg' hidden/>
                        <button className='btn-light mt-5 max-lg:center lg:w-full px-10'>Upload</button>
                    </div>
                    <div className='w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                            <div>
                                <InputBox name="fullname" type="text" value={fullname} placeholder="FullName" disable={true}/>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        }
    </AnimationWrapper>
  )
}

export default EditProfile
