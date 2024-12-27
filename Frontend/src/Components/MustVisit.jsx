import React, { useContext } from "react";
import { EditorContext } from "../Pages/Editor";

const MustVisit = ({ place,placeIndex }) => {
  const { trip, trip: { mustvisit }, setTrip } = useContext(EditorContext);

  const handleDelete = () => {
    const updatedMustVisit = mustvisit.filter((item) => item !== place);
    setTrip({ ...trip, mustvisit: updatedMustVisit });
  };
  const handlePlaceEdit = (e) =>{
    if(e.keyCode==13||e.keyCode==188){
      e.preventDefault();
      let currentPlace=e.target.innerText;
      mustvisit[placeIndex]=currentPlace;
      setTrip({...trip,mustvisit});
      e.target.setAttribute("contentEditable",false);
    }
  }
  const addEditMustVisit = (e) =>{
    e.target.setAttribute("contentEditable",true);
    e.target.focus();
  }

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
      <p className="outline-none" onKeyDown={handlePlaceEdit}  onClick={addEditMustVisit}>
        {place}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleDelete}
        aria-label="Delete Place"
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default MustVisit;
