import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '../Common/AnimationWrapper';
import Loader from '../Components/Loader';
import { UserContext } from '../App';
import AboutUser from '../Components/AboutUser';
import { filterPaginationData } from '../Common/FilterPagination';
import InPageNavigation from '../Components/InPageNavigation';
import TripPost from '../Components/TripPost';
import NoData from '../Components/NoData';
import LoadMoreDataBtn from '../Components/LoadMoreDataBtn';
import NotFound from '../Components/NotFound';

export const profileDataStructure ={
  "personal_info": {
        "fullname": "",
        "username": "",
        "bio": "",
        "profile_img": ""
    },
    "social_links": {

    },
    "account_info": {
        "total_posts": 0,
        "total_reads": 0
    },
    "joinedAt": ""
}

const Profile = () => {

  const {id:profileId}=useParams();

  const [profile,setProfile]=useState(profileDataStructure);

  const [trips,setTrips]=useState(null);

  const [loading,setLoading]=useState(true);

  const [profileLoaded,setProfileLoaded]=useState("");

  const {userAuth:{username}} = useContext(UserContext);

  const {personal_info:{fullname,username:profile_username,profile_img,bio},account_info:{total_posts,total_reads},social_links,joinedAt} = profile;

  const fetchUserProfile = () =>{
    axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"get-profile",{username:profileId})
    .then(({data:user})=>{
      if(user!=null){
        setProfile(user);
      }
      setProfileLoaded(profileId);
      getTrips({user_id:user._id})
      setLoading(false);
    })
    .catch(err=>{
      console.log(err);
      setLoading(false);
    })
  }

  const getTrips=({page=1,user_id})=>{
    user_id = user_id == undefined ? trips.user_id : user_id; 
    axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"search-trips",{
      author:user_id,
      page
    })
    .then(async({data})=>{
      const formatedData = await filterPaginationData({
        state:trips,
        data:data.trips,
        page,
        countRoute:"search-trips-count",
        data_to_send:{author:user_id}
      })
      formatedData.user_id=user_id;
      setTrips(formatedData);
    })

  }

  useEffect(()=>{
    if(profileId!=profileLoaded){
      setTrips(null);
    }
    if(trips==null){
      resetState();
      fetchUserProfile();
    }
  },[profileId,trips])

  const resetState = () =>{
    setTrips(null);
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  }

  return (
    <AnimationWrapper>
      {
        loading?<Loader/>:profile_username.length?
        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
          <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10'>

            <img src={profile_img} className='w-48 bg-grey rounded-full md:w-32 md-h-32 '/>

            <h1 className='text-2xl font-medium'>@{profile_username}</h1>

            <p className='text-xl capitalize h-6'>{fullname}</p>

            <p>{total_posts.toLocaleString()} Trips - {total_reads.toLocaleString()} Reads</p>

            <div className='flex gap-4 mt-2'>
              {
                profileId==username ? 
                <Link to='/settings/edit-profile' className='btn-light rounded-md'>Edit Profile</Link>
                :""
              }
              
            </div>
            <AboutUser className='max-md:hidden' bio={bio} social_links={social_links} joinedAt={joinedAt}/>
          </div>
          <div className='max-md:mt-12 w-full'>
          <InPageNavigation 
            routes={["Trips Published","About"]}
            defaultHidden={["About"]}
            >
              <>
                  {
                      trips == null ? <Loader/> :
                      (trips.results.length)?
                          trips.results.map((trip,i)=>{
                              return <AnimationWrapper transition={{duration:2,delay:i*.1}} key={i}>
                                  <TripPost tripData={trip} author={trip.author.personal_info}/>
                              </AnimationWrapper>
                          })
                      :<NoData message="No Trips Planned"/>
                  }
                  <LoadMoreDataBtn state={trips} fetchDataFunc={getTrips}/>
              </>
              <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt}/>
            </InPageNavigation>
          </div>
        </section>
        :
        <NotFound/>
      }
    </AnimationWrapper>
  )
}

export default Profile
