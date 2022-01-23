import React from "react";

export default function Navbar(props) {

  return (  
    <>
        <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center mt-24">
          <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
            {/* Brand */}
            <a
              className="text-white text-lg uppercase hidden lg:inline-block font-semibold"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              {props.title}
            </a>
          </div>
        </nav>
    </>
  );
}


