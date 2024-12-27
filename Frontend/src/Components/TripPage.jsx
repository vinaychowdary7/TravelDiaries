import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '../Common/AnimationWrapper';
import Loader from './Loader';
import { getDate } from '../Common/Date';
import BlogInteration from './BlogInteration';

export const TripStructure= {
    title:'',
    budget:'',
    duration:'',
    location:'',
    content:[],
    mustvisit:[],
    stay:'',
    author:{personal_info:{

    }},
    publishedAt:''
}

const TripPage = () => {
    const {trip_id} = useParams();
    const [trip,setTrip]=useState(TripStructure);
    const [loading,setLoading]=useState(true);

    const {title,location,duration,budget,mustvisit,stay,content,author:{personal_info:{fullname, username : author_username,profile_img}},publishedAt}=trip;
    const fetchTrip=()=>{
        axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+'get-trip',{trip_id})
        .then(({data:{trip}})=>{
            setTrip(trip);
            setLoading(false);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    useEffect(() => {
        fetchTrip();
    }, [])
  return (
    <AnimationWrapper>
        {
            loading?<Loader/>:
            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                <div className='mt-12'>
                    <div
                    className="flex flex-col gap-y-2 mt-4 items-center">
                        <h2>Go to<span className="py-1 px-4 text-3xl sm:text-4xl" style={{ color: "#F73D93" }}>{location}</span></h2>
                        <h2>With<span className="py-1 px-4 text-3xl sm:text-4xl" style={{ color: "#009990" }}>{budget}</span></h2>
                        <h2>For<span className="py-1 px-4 text-3xl sm:text-4xl" style={{ color: "#69247C" }}>{duration}</span></h2>
                    </div>
                    <hr className='mt-5 mb-5 border-black'></hr>
                    <h2>{title}</h2>
                    <div className='flex max-sm:flex-col justify-between my-8'>
                        <div className='flex gap-5 items-start'>
                        <img src={profile_img} className='w-12 h-12 rounded-full'/>
                        <p className='captalize'>
                            {fullname}
                            <br/>@
                            <Link to={`/user/${author_username}`} className='underline '>{author_username}</Link>
                        </p>
                        </div>
                        <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {getDate(publishedAt)}</p>
                    </div>
                </div>
                <BlogInteration />
            </div>
        }
    </AnimationWrapper>
  )
}

export default TripPage
