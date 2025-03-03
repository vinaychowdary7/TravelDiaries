import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/travel.png';
import { ThemeContext, UserContext } from '../App';
import UserNavigation from './UserNavigation';
import { storeInSession } from '../Common/Session';

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  let {theme,setTheme}=useContext(ThemeContext);

  const navigate = useNavigate();

  const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext);
  const userNavRef = useRef(null);

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleClickOutside = (event) => {
    if (userNavRef.current && !userNavRef.current.contains(event.target)) {
      setUserNavPanel(false);
    }
  };
  const handleSearch = (e) =>{
    const query = e.target.value;
    if(e.keyCode==13 && query.length){
      navigate(`/search/${query}`)
    }
  }
  const changeTheme = () =>{
    let newTheme = theme == "light" ? "dark" :"light"; 
    setTheme(newTheme);
    document.body.setAttribute("data-theme",newTheme);
    storeInSession("theme",newTheme);
  }

  useEffect(() => {
    if (userNavPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userNavPanel]);

  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className="flex-none w-10">
          <img src={logo} className="w-full " />
        </Link>
        <div
          className={
            'absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' +
            (searchBoxVisibility ? 'show' : 'hide')
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />
          <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="fi fi-br-search text-xl"></i>
          </button>

          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/20" onClick={changeTheme}>
          <i className="fi fi-sr-moon-stars"></i>
          </button>

          {access_token ? (
            <>
              <div className="relative" ref={userNavRef}>
                <button className="w-12 h-12 mt-1" onClick={handleUserNavPanel}>
                  <img
                    src={profile_img}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
                {userNavPanel && <UserNavigation />}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
