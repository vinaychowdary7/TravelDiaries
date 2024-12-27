import React from 'react'
import Date, { getDate } from '../Common/Date';
import {Link} from "react-router-dom"

const TripPost = ({tripData,author}) => {

    const {publishedAt,title,mustvisit,location,budget,content,duration,activity:{total_likes},trip_id:id}=tripData;
    const {fullname,profile_img,username}=author;
    const firstParagraph = content?.[0]?.blocks.find(block => block.type === 'paragraph')?.data.text || '';

    return (
        <Link to={`/trip/${id}`}>
            <div className='w-full border-b border-grey pb-5 mb-4'>
                <div className='flex gap-2 items-center mb-6'>
                    <img src={profile_img} className='w-6 h-6 rounded-full'/>
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDate(publishedAt)}
                    </p>
                </div>
                <h1 className='trip-title'>{title}</h1>
                <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden line-clamp-2'>{firstParagraph}</p>
                <div className='flex flex-wrap gap-x-4 gap-y-2 mt-4'>
                    <span className='btn-light py-1 px-4' style={{ color: "#F73D93" }}>{location}</span>
                    <span className='btn-light py-1 px-4'style={{ color: "#009990" }}>{budget}</span>
                    <span className='btn-light py-1 px-4'style={{ color: "#69247C" }}>{duration}</span>
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <i className='fi fi-rr-heart text-xl'></i>
                        {total_likes}
                    </span>
                </div>
            </div>
        </Link>
        
    )
}

export default TripPost
