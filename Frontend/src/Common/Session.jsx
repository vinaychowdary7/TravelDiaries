const storeInSession = (key,value) => {
   return sessionStorage.setItem(key,value);
}

const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) =>{
    const data= sessionStorage.removeItem(key);
    return data ? data : null;
}

const logOutUser = () =>{
    sessionStorage.clear();
}

export {storeInSession,lookInSession,removeFromSession,logOutUser};
