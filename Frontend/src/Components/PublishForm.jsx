import React, { useContext } from "react";
import AnimationWrapper from "../Common/AnimationWrapper";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../Pages/Editor";
import MustVisit from "./MustVisit";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
  const characterLimit=200;
  const { trip, trip: { title, location, mustvisit, stay , duration , content , budget}, setTrip, setEditorState } = useContext(EditorContext);

  const {userAuth:{access_token}} =useContext(UserContext);

  const navigate=useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleTripTitle = (e) => {
    setTrip({ ...trip, title: e.target.value });
  };

  const handleStay = (e) => {
    const input = e.target;
    input.style.height='auto';
    input.style.height = `${input.scrollHeight}px`;
    setTrip({ ...trip, stay: input.value });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      const place = e.target.value.trim();
      if (place && !mustvisit.some((p) => p.toLowerCase() === place.toLowerCase())) {
        setTrip({ ...trip, mustvisit: [...mustvisit, place] });
        e.target.value = "";
      } else {
        toast.error("Must Visit places should be unique");
      }
    }
  };

  const publishTrip =(e)=>{
    if(e.target.className.includes('disable')){
      return ;
    }
    if(!title.length){
      return toast.error("Write title of trip before publishing")
    }
    if(!stay.length){
      return toast.error("Write stay details of trip before publishing")
    }
    if(!mustvisit.length){
      return toast.error("Enter atleast 1 mustvisit place")
    }

    let loadingToast=toast.loading("Publishing......");

    e.target.classList.add('disable');

    let tripObj={title,location, mustvisit, stay , duration , content , budget}

    axios.post(import.meta.env.VITE_BACKEND_SERVER_DOMAIN+"post-trip",tripObj,{
      headers:{
        'Authorization':`Bearer ${access_token}`
      }
    })
    .then(()=>{
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);
      toast.success("Published 👍");
      setTimeout(()=>{
        navigate("/");
      },500);
    })
    .catch(({response})=>{
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);
      if (response && response.data && response.data.error) {
        return toast.error(response.data.error);
      } else {
        return toast.error("An unexpected error occurred. Please try again.");
      }
    })

  }

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center py-16">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2" >
            {title}
          </h1>
          <p className="font-gelasio text-xl leading-7 mt-4 break-words whitespace-pre-wrap">
            {stay}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey md-2 mt-9">Title of Trip Experience</p>
          <input
            type="text"
            placeholder="Title of Trip Experience"
            defaultValue={title}
            className=" w-full input-box pl-4"
            onChange={handleTripTitle}
            maxLength={characterLimit}
          />
          <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit-title.length } characters left</p>
          <p className="text-dark-grey md-2 mt-9">Stay and Food</p>
          <textarea
            defaultValue={stay}
            className="min-h-40 resize-none leading-7 input-box pl-4 overflow-hidden" 
            onChange={handleStay}
            placeholder="Details of accommodation, must-try local cuisine, and their associated costs."
          ></textarea>
          <p className="text-dark-grey mb-2 mt-9">Must Visit Places</p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="places"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {mustvisit.map((place, i) => (
              <MustVisit key={i} placeIndex={i} place={place} />
            ))}
          </div>
          <button 
          className="btn-dark px-8 mt-5"
          onClick={publishTrip}>Publish</button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
