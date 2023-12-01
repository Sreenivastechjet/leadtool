import React from "react";
import notFount from "../images/404.png"
function NotFoundPage() {
  return (
    <div
      className=""
      
    >
      <div className="d-flex justify-content-center align-items-center pt-5">
        <img className="img-responsive " src={notFount} />
      </div>

      <div
        className="d-flex justify-content-center align-items-center"
        id="main"
      >
        <h1 className="mr-3 pr-3 align-top inline-block align-content-center slide-up">
         <span className="border-right pr-2">404 ERROR</span> <span className="font-weight-normal lead" id="desc">The page you requested was not found.</span>
          
        </h1>
        
      </div>
    </div>
  );
}

export default NotFoundPage;
