/*eslint-disable*/
import React ,{ useEffect,useState }from "react";
import { createPopper } from "@popperjs/core";
import { useHistory } from "react-router-dom";
// components
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Navbar(props) {

  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [isThai,setIsThai] = React.useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const history = useHistory();

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  // dropdown props
  const [dropdownAdminPopUpShow, setDropDownAdminOverShow] = React.useState(false);
  const btnDropDownAdminRef = React.createRef();
  const popoverAdminRef = React.createRef();
  const openDropDownPopUp = () => {
    createPopper(btnDropDownAdminRef.current, popoverAdminRef.current, {
      placement: "bottom-start",
    });
    setDropDownAdminOverShow(true);
  };
  const closeDropDownPopUp = () => {
    setDropDownAdminOverShow(false);
  };

  const ChangeTranslate = (e) => {
    if(e.target.id === "thaix")
      setIsThai(true);
    else 
      setIsThai(false)
    localStorage.setItem("translate",(e.target.id === "thaix") ? true : false);
  }
  
  useEffect(() => {
    resizeWindow();
    const isValue = localStorage.getItem("translate")
    var result = (isValue === 'true');
    setIsThai((result));
  
    const checkIfClickedOutside = (e) => {
      if (dropdownAdminPopUpShow && e.toElement.id !== "thaix" && e.toElement.id !== "engx" && e.toElement.id !== "ham" ||  e.toElement.id === ""  ) {
        setDropDownAdminOverShow(false);
      }else if (e.toElement.id === "")
        setDropDownAdminOverShow(false);
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    window.addEventListener("resize", resizeWindow);
    return () => { window.removeEventListener("resize", resizeWindow); document.removeEventListener("mousedown", checkIfClickedOutside);};
  }, []);

  const ClickHome = () =>{
    if(window.location.href.includes("admin"))
    {
      history.push("/admin");
    }else{
      history.push("/home");
    }
  }

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap  justify-between px-2 py-2 navbar-expand-lg bg-green-mju">
        <div className=" px-4 flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className={"flex items-center text-lg font-bold text-white "  +  (windowWidth < 1024 ? " hidden" : "block")}>
                <img
                  alt="..."
                  src={require("assets/img/Logo_x3.png").default}
                  className="h-auto align-middle border-none max-w-100-px"
                />
              </li>
              <li className={"flex items-center text-lg font-bold text-white " +  (windowWidth < 1024 ? " hidden" : "block") }>
                &nbsp;   | &nbsp;
              </li>
              <li className="flex items-center text-lg font-bold text-white cursor-pointer" onClick={()=>{ClickHome()}}>
                Organic Masterclass
              </li>
            </ul>
          </div>
        </div>
        <div className="px-4 flex flex-wrap items-center justify-between w-3">

              <a
                className="text-blueGray-500"
                href="#pablo"
                ref={btnDropDownAdminRef}
                id="ham"
                onClick={(e) => {
                  e.preventDefault();
                  dropdownAdminPopUpShow ? closeDropDownPopUp() : openDropDownPopUp();
                }}
              >
                <div className={"items-center flex cursor-pointer" + (windowWidth < 1024 ? " block" : " hidden")}>
                  <span className="w-12 h-12 text-sm bg-blueGray-200 inline-flex items-center justify-center rounded-lg">
                    <i className="fas fa-bars"></i>
                  </span>
                </div>
              </a>
              <span className={"w-12 h-12 text-sm bg-blueGray-200 inline-flex ml-3 items-center justify-center rounded-lg" + (windowWidth < 1024 ? " block" : " hidden")}>
                <UserDropdown /> 
              </span>

              <div
                ref={popoverAdminRef}
                className={
                  (dropdownAdminPopUpShow && windowWidth < 1024  ? "block " : "hidden ") +
                  "bg-white text-base z-50  float-right py-2  mt-2-im list-none text-left rounded shadow-lg "
                }
              >
                <a
                  href="#pablo"
                  id="thaix"
                  className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 "
                    + (!isThai
                      ? "opacity-75"
                      : "textUnderline")}
                      onClick={(e) => {ChangeTranslate(e)}}
                >
                  ภาษาไทย
                </a>
                <a
                  href="#pablo"
                  id="engx"
                  className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 "
                   + (isThai
                      ? "opacity-75"
                      : "textUnderline")}
                      onClick={(e) => {ChangeTranslate(e)}}
                >
                  English
                </a>
              </div>


              <div
                className={
                  "lg:flex flex-grow items-center lg:bg-opacity-0" +
                  (navbarOpen ? " block" : " hidden")
                }
                id="example-navbar-warning"
              >
              <ul className={"flex flex-col lg:flex-row list-none lg:ml-auto" + (windowWidth < 1024 ? " hidden" : "block") }>
                <li className="flex items-center text-sm font-bold text-white cursor-pointer">
                  <i className="fas fa-globe"></i>&nbsp;&nbsp;
                </li>
                <li className={"flex items-center text-sm font-bold text-white cursor-pointer "+ (!isThai
                        ? "opacity-75"
                        : "textUnderline")}
                    id="thaix"
                    onClick={(e) => {ChangeTranslate(e)}}>
                  ภาษาไทย
                </li>
                <li className="flex items-center text-lg font-bold text-white">
                &nbsp;|&nbsp;
                </li>
                <li className={"flex items-center text-sm font-bold text-white cursor-pointer " + (isThai
                        ? "opacity-75"
                        : "textUnderline") }
                    id="engx" 
                    onClick={(e) => {ChangeTranslate(e)}}>
                  English
                </li>

                <li className="flex items-center">
                  &nbsp;&nbsp;&nbsp;
                  <UserDropdown />
                </li>
              </ul>
            </div>
        </div>
      </nav>
    </>
  );
}
