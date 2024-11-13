import React from 'react';


const Loading: React.FC = () => {

    return (
     <div className="loading-screen flex items-center justify-center h-screen">
      <img
        src="/path-to-your-image.png"  // Replace this with the path to your loading image
        alt="Loading"
        className="loading-image"
      />
    </div>
    );
};

export default Loading;