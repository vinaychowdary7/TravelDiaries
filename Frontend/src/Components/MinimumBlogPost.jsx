import React from 'react'
import { Link } from 'react-router-dom';
import { getDate } from '../Common/Date';

const MinimumBlogPost = ({trip,index}) => {

    const {title,trip_id,author:{personal_info:{fullname,username,profile_img}},publishedAt} =trip;

    return (
        <Link to={`/trip/${trip_id}`} className='flex gap-5 mb-8'>
            <h1 className='trip-index'>
                {index<9?"0"+(index+1):(index+1)}
            </h1> 
            <div>
                <div className='flex gap-2 items-center mb-6'>
                    <img src={profile_img} className='w-6 h-6 rounded-full'/>
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDate(publishedAt)}
                    </p>
                </div>
                <h1 className='trip-title line-clamp-2'>{title}</h1>
            </div>
        </Link>
    )
}

export default MinimumBlogPost
