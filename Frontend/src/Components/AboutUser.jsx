import React from 'react'
import { Link } from 'react-router-dom';
import { getFullDay } from '../Common/Date';

const AboutUser = ({className,bio,social_links,joinedAt}) => {
  return (
    <div className={'md:w-[90%] md:mt-7 '+className}>
      <p className='text-xl leading-7'>
        {bio.length?bio:"Nothing to read here"}
      </p>
      <div className='flex flex-wrap gap-x-7 gap-y-2 my-7 items-center text-dark-grey'>
        {
            Object.keys(social_links).map((key)=>{
                const link=social_links[key];
                return link?<Link to={link} key={key} target='_blank' ><i className={'fi '+(key!='website'?("fi-brands-"+key):"fi-rr-globe")+ " test-2xl hover:text-black"}></i></Link>:" "
                
            })
        }
      </div>
      <p className='text-xl leading-7 text-dark-grey '>{getFullDay(joinedAt)}</p>
    </div>
  )
}

export default AboutUser