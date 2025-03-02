import React, { useState } from 'react'

const InputBox = ({name,type,id,value,placeholder,icon , disable=false}) => {

    const [passwordVidible,setPasswordVidible]=useState(false);

  return (
    <div className='relative w-[100%] mb-4'>
        <input
            name={name}
            type={type=="password"? passwordVidible ? "text" : "password" :type}
            placeholder={placeholder}
            defaultValue={value}
            id={id}
            className='input-box'
        />
        <i className={"fi "+icon+ " input-icon"}></i>
        {
            type=="password"?
            <i class={"fi fi-rs"+(!passwordVidible?"-crossed":"")+"-eye input-icon left-[auto] right-4 cursor-pointer"} onClick={()=>setPasswordVidible(currentVal=>!currentVal)}></i>
            :""
        }
    </div>
  )
}

export default InputBox
