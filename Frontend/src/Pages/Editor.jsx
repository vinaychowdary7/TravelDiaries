import React, { createContext, useContext, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom';
import BlogEditor from '../Components/BlogEditor';
import PublishForm from '../Components/PublishForm';

const tripStructure ={
    title:"",
    budget:"",
    duration:"",
    location:"",
    content:[],
    mustvisit:[],
    stay:"",
    author:{personal_info:{}}

}

export const EditorContext = createContext({});

const Editor = () => {

    const [trip,setTrip]=useState(tripStructure);

    const [editorState,setEditorState]=useState("editor");
    const [textEditor,setTextEditor]=useState({isReady:false});

    const {userAuth:{access_token}} = useContext(UserContext);

  return (
    <EditorContext.Provider value={{trip,setTrip,editorState,setEditorState,textEditor,setTextEditor}}>
        {
            access_token==null
            ?<Navigate to="/signin"/>
            :editorState=="editor"?<BlogEditor/>:<PublishForm/>
        }
    </EditorContext.Provider>

  )
}

export default Editor
