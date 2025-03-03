import React, { createContext, useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import { Routes,Route } from 'react-router-dom'
import UserAuthForm from './Pages/UserAuthForm'
import { lookInSession } from './Common/Session'
import Editor from './Pages/Editor'
import HomePage from './Pages/HomePage'
import SearchPage from './Pages/SearchPage'
import NotFound from './Components/NotFound'
import Profile from './Pages/Profile'
import TripPage from './Components/TripPage'
import SideNav from './Components/SideNav'
import ChangePassword from './Components/ChangePassword'
import EditProfile from './Components/EditProfile'

const UserContext = createContext({});
const ThemeContext = createContext({});

const App = () => {

  const [userAuth, setUserAuth] = useState(() => {
    const userInSession = lookInSession("user");
    return userInSession ? JSON.parse(userInSession) : { access_token: null };
  });
  
  const [theme,setTheme] = useState("light");

  useEffect(() => {
    if (userAuth && userAuth.access_token) {
      sessionStorage.setItem("user", JSON.stringify(userAuth));
    }
  }, [userAuth]);

  useEffect(()=>{
    let themeInSession = lookInSession("theme");
    if(themeInSession){
      setTheme(()=>{
        document.body.setAttribute('data-theme',themeInSession);
      })
    }
    else{
      document.body.setAttribute('data-theme',theme)
    }
  },[])
  return (
    <ThemeContext.Provider value={{theme,setTheme}}>
      <UserContext.Provider value={{userAuth,setUserAuth}}>
        <Routes>
          <Route path='/editor' element={<Editor/>}/>
          <Route path='/' element={<Navbar/>} >
          <Route index element={<HomePage/>}/>
          <Route path='settings' element={<SideNav/>}>
            <Route path='edit-profile' element={<EditProfile/>}/>
            <Route path='change-password' element={<ChangePassword/>}/>
          </Route>
          <Route path='signin' element={<UserAuthForm type="signin"/>} />
          <Route path='signup' element={<UserAuthForm type="signup"/>} />
          <Route path='search/:query' element={<SearchPage/>}/>
          <Route path='user/:id' element={<Profile/>}/>
          <Route path='*' element={<NotFound/>}/>
          <Route path='trip/:trip_id' element={<TripPage/>}/>
          </Route>
        </Routes>
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
export {UserContext,ThemeContext}
