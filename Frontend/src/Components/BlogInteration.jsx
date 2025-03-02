import React, { useContext, useEffect } from 'react'
import { TripContext } from './TripPage';
import { UserContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const BlogInteration = () => {
  let {trip,trip:{_id,activity,activity:{total_likes}},setTrip,isLikedByUser,setIsLikedByUser} =useContext(TripContext);

  let{userAuth:{username,access_token}}=useContext(UserContext);

  useEffect(()=>{
    if(access_token){
      axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"isLikedByUser",{_id},{
        headers:{
          'Authorization':`Bearer ${access_token}`
        }
      })
      .then(({data:{result}})=>{
        setIsLikedByUser(Boolean(result))
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },[])

  const handleLike = ()=>{
    if(access_token){
      setIsLikedByUser(preVal=>!preVal)
      !isLikedByUser?total_likes++:total_likes--;
      setTrip({...trip,activity:{...activity,total_likes}});
      axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"liked-trip",{_id,isLikedByUser},{
        headers:{
          'Authorization':`Bearer ${access_token}`
        }
      })
      .then(data=>{
        console.log(data);
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else{
      toast.error('Please login to like this blog')
    }
  }

  return (
    <>
    <Toaster/>
    <hr className='border-grey my-2'/>
    <div className='flex gap-6'>
      <div className='flex gap-3 items-center'>
        <button 
        onClick={handleLike}
        className={'w-10 h-10 rounded-full flex items-center justify-center '+(isLikedByUser?' bg-red/20 text-red': ' bg-grey/80')}>
          <i className={'flex items-center justify-center fi fi-'+(isLikedByUser?'s':'r')+'r-heart'}></i>
        </button>
        <p className='text-xl text-dark-grey'>
          {total_likes}
        </p>
      </div>
      <div className='flex gap-3 items-center'>
        
        <p className='text-xl text-dark-grey'>
          Give ❤️ if this Trip Experience is Helpful
        </p>
      </div>
    </div>
    <hr className='border-grey my-2'/>
    </>
  )
}

export default BlogInteration
