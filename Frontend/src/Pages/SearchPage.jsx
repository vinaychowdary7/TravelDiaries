import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InPageNavigation from '../Components/InPageNavigation';
import Loader from '../Components/Loader';
import AnimationWrapper from '../Common/AnimationWrapper';
import TripPost from '../Components/TripPost';
import NoData from '../Components/NoData';
import LoadMoreDataBtn from '../Components/LoadMoreDataBtn';
import axios from 'axios';
import { filterPaginationData } from '../Common/FilterPagination';
import UserCard from '../Components/UserCard';

const SearchPage = () => {
    const {query} =useParams();
    const [trips,setTrip]=useState(null);
    const [users,setUser]=useState(null);

    const searchTrips = ({page=1,create_new_arr=false})=>{
        axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"search-trips",{query,page})
        .then(async({data})=>{
            const formatedData = await filterPaginationData({
                state:trips,
                data:data.trips,
                page,
                countRoute:"search-trips-count",
                data_to_send:{query},
                create_new_arr
            })
            setTrip(formatedData);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const fetchUsers =()=>{
        axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"search-users",{query})
        .then(({data:{users}})=>{
            setUser(users)
        })
    }

    useEffect(()=>{
        resetState();
        searchTrips({page:1,create_new_arr:true});
        fetchUsers();
    },[query])

    const resetState = () =>{
        setTrip(null);
        setUser(null);
    }

    const UserCardWrapper = () =>{
        return(
            <>
                {
                    users==null?
                    <Loader/>:
                    users.length?
                    users.map((user,i)=>{
                        return (
                            <AnimationWrapper 
                            key={i}
                            transition={{duration:1,delay:i*0.08}} 
                            >
                                <UserCard user={user}/>
                            </AnimationWrapper>
                        )
                    }):
                    
                    <NoData message="No User Found"/>
                }
            </>
        )
    }

  return (
    <section className='h-cover flex justify-center gap-10'>
        <div className='w-full'>
            <InPageNavigation routes={[`Search results from "${query}"`,"Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
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
                <LoadMoreDataBtn 
                state={trips} 
                fetchDataFunc = {searchTrips}/>
            </>
            <UserCardWrapper/>
            </InPageNavigation>
            
        </div>
        <div className='min-w-[35%] lg:min-w-[350px] max-w-min border-grey pl-8 pt-3 max-md:hidden'>
                <h1 className='font-medium text-xl mb-8'>
                    User related to search<i className='fi fi-rr-user'></i>
                </h1>
                <UserCardWrapper/>
        </div>
    </section>
  )
}

export default SearchPage
