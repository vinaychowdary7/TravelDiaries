import React from 'react';

const TripStayAndMustVisit = ({ stay, mustvisit }) => {
  return (
    <>
      <h2 className="text-xl text-dark-grey">Stay Details</h2>
      <p className="whitespace-pre-line font-gelasio mt-2">{stay}</p>
      
      <h2 className="text-xl text-dark-grey mt-4">Must Visit Places</h2>
      <ul className="list-disc list-inside font-gelasio capitalize mt-2">
        {mustvisit.map((place, index) => (
          <li key={index}>{place}</li>
        ))}
      </ul>
      </>
  );
};

export default TripStayAndMustVisit;
