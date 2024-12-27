import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/travel.png"
import AnimationWrapper from '../Common/AnimationWrapper'
import { EditorContext } from '../Pages/Editor'
import EditorJS from '@editorjs/editorjs'
import { tools } from './Tools'
import toast, { Toaster } from 'react-hot-toast'

const BlogEditor = () => {

    const {trip,
        trip:
        {
            title,
            budget,
            duration,
            location,
            content,
            mustvisit,
            stay
        },
        setTrip,
        textEditor,
        setTextEditor,
        setEditorState} =useContext(EditorContext);

    useEffect(()=>{
        setTextEditor(new EditorJS({
            holder:"textEditor",
            data:content,
            tools:tools,
            placeholder:"Let's Wirte the Experience of the Trip"
        }))
    },[])

    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }
    const handleTitleChange = (e) => {
        const input = e.target;
        input.style.height = 'auto'; 
        input.style.height = input.scrollHeight + "px";
        setTrip({...trip,title:input.value});
    }
    const handleLocationChange = (e) => {
        const input = e.target;
        input.style.height = 'auto'; 
        input.style.height = input.scrollHeight + "px";
        setTrip({...trip,location:input.value});
    }
    const handleBudgetChange = (e) => {
        const input = e.target;
        input.style.height = 'auto'; 
        input.style.height = input.scrollHeight + "px";
        setTrip({...trip,budget:input.value});
    }
    const handleDurationChange = (e) => {
        const input = e.target;
        input.style.height = 'auto'; 
        input.style.height = input.scrollHeight + "px";
        setTrip({...trip,duration:input.value});
    }

    const handlePublishEvent = () =>{
        if(!title.length){
            return toast.error("Write Title of Your Trip Experience to publish it")
        }
        if(!location.length){
            return toast.error("Write Visited Trip place to publish it")
        }
        if(!budget.length){
            return toast.error("Write Budget of Trip to publish it")
        }
        if(!duration.length){
            return toast.error("Write Duration of Trip to publish it")
        }
        if(textEditor.isReady){
            textEditor.save().then(data=>{
                if(data.blocks.length){
                    setTrip({...trip,content:data});
                    setEditorState("publish")
                }
                else{
                    return toast.error("Write Budget breakdown and plan of your trip to publish it")
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className='flex-none w-10'>
                    <img src={logo} alt="logo" />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>{title.length?title:"New Trip"}</p>

                <div className='flex gap-4 ml-auto'>
                    <button 
                    className='btn-dark py-2'
                    onClick={handlePublishEvent}
                    >
                        Publish
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <Toaster/>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                    <textarea
                            defaultValue={title}
                            placeholder='Title of Travel Experience'
                            className='text-4xl font-medium w-full min-h-[40px] outline-none resize-none mt-10 leading-snug placeholder:opacity-40'
                            onKeyDown={handleKeyDown}
                            onChange={handleTitleChange}
                            >
                        </textarea>
                        <hr className='w-full opacity-10 my-5'/>
                        <textarea
                            defaultValue={location}
                            placeholder='Trip Place'
                            className='text-2xl font-medium w-full min-h-[30px] outline-none resize-none mt-7 leading-snug placeholder:opacity-40'
                            onKeyDown={handleKeyDown}
                            onChange={handleLocationChange}
                            >
                        </textarea>
                        <hr className='w-full opacity-10 my-5'/>
                        <textarea
                            defaultValue={budget}
                            placeholder='Trip Budget'
                            className='text-2xl font-medium w-full min-h-[30px] outline-none resize-none mt-7 leading-snug placeholder:opacity-40'
                            onKeyDown={handleKeyDown}
                            onChange={handleBudgetChange}
                            >
                        </textarea>
                        <hr className='w-full opacity-10 my-5'/>
                        <textarea
                            defaultValue={duration}
                            placeholder='Trip Duration'
                            className='text-2xl font-medium w-full min-h-[30px] outline-none resize-none mt-7 leading-snug placeholder:opacity-40'
                            onKeyDown={handleKeyDown}
                            onChange={handleDurationChange}
                            >
                        </textarea>
                        <hr className='w-full opacity-10 my-5'/>
                        <div id='textEditor' className='font-gelasio'>

                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor
