import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../Common/AnimationWrapper'
import InPageNavigation from '../Components/InPageNavigation'
import axios from 'axios'
import Loader from '../Components/Loader'
import TripPost from '../Components/TripPost'
import MinimumBlogPost from '../Components/MinimumBlogPost'
import { activeTabRef } from '../Components/InPageNavigation'
import NoData from '../Components/NoData'
import { filterPaginationData } from '../Common/FilterPagination'
import LoadMoreDataBtn from '../Components/LoadMoreDataBtn'

const HomePage = () => {
    
    const [trips,setTrip]=useState(null);
    const [trendingTrips,setTrendingTrips]=useState(null);
    const [pageState,setPageState]=useState("home");

    const popular = ["Pondicherry",
        "Agra", 
        "Jaipur", 
        "Varanasi", 
        "Kerala", 
        "Goa", 
        "Rajasthan", 
        "Darjeeling", 
        "Leh-Ladakh", 
        "Kolkata"]

    const fetchLatestTrips=(page=1)=>{
        axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+'latest-trips',{page})
        .then(async({data})=>{
            const formatedData = await filterPaginationData({
                state:trips,
                data:data.trips,
                page,
                countRoute:"all-latest-trips-count"
            })
            setTrip(formatedData);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    const fetchByPopularDestination=(page=1)=>{
        axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+'search-trips',{location:pageState,page})
        .then(async({data})=>{
            const formatedData = await filterPaginationData({
                state:trips,
                data:data.trips,
                page,
                countRoute:"search-trips-count",
                data_to_send:{location:pageState}
            })
            setTrip(formatedData);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    const fetchTrendingTrips=()=>{
        axios.get(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+'trending-trips')
        .then(({data})=>{
            setTrendingTrips(data.trips);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    const handlePopularDestinations =(e)=>{
        const destination =e.target.innerText;
        setTrip(null);

        if(pageState==destination){
            setPageState("home");
            return ;
        }
        setPageState(destination);

    }

    useEffect(()=>{

        activeTabRef.current.click();

        if(pageState=="home"){
            fetchLatestTrips({page:1});
        }
        else{
            fetchByPopularDestination({page:1});
        }

        if(!trendingTrips)
        fetchTrendingTrips();
    },[pageState])

    return (
        <AnimationWrapper>
            <section className='h-cover flex justify-center gap-10'>
                <div className='w-full'>
                    <InPageNavigation 
                    routes={[pageState,"Trending Trips"]}
                    defaultHidden={["Trending Trips"]}
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
                            <LoadMoreDataBtn state={trips} fetchDataFunc={(pageState=='home'?fetchLatestTrips:fetchByPopularDestination)}/>
                        </>
                        {
                            trendingTrips == null ? <Loader/> :
                            trendingTrips.length?
                                trendingTrips.map((trip,i)=>{
                                    return <AnimationWrapper transition={{duration:2,delay:i*.1}} key={i}>
                                        <MinimumBlogPost trip={trip} index={i}/>
                                    </AnimationWrapper>
                                })
                            :<NoData message="No Trending Trips"/>
                        }
                    </InPageNavigation>
                </div>
                <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <div className='flex flex-col gap-10'>
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Popular Destinations</h1>
                            <div className='flex gap-3 flex-wrap'>
                                {
                                    popular.map((destination,i)=>{
                                        return <button
                                        className={'tag '+(pageState==destination ?" bg-black text-white ":"")}
                                        onClick={handlePopularDestinations}
                                        >
                                            {destination}
                                        </button>
                                    })
                                }
                            </div>
                        </div>
                        <div>
                            <h1 className='font-medium text-xl mb-8'>
                                Trending
                                <i className='fi fi-rr-arrow-trend-up'></i>
                            </h1>
                            {
                                trendingTrips == null ? <Loader/> :
                                trendingTrips.length?
                                    trendingTrips.map((trip,i)=>{
                                        return <AnimationWrapper transition={{duration:2,delay:i*.1}} key={i}>
                                            <MinimumBlogPost trip={trip} index={i}/>
                                        </AnimationWrapper>
                                    })
                                :<NoData message="No Trending Trips"/>
                            }   
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage
