/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar() {



  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [enableCollapse, setenableCollapse] = React.useState("hidden");
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6 mt-20">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => {
                if(enableCollapse === "hidden")
                { 
                  setenableCollapse("block");
                  setCollapseShow("bg-white m-2 py-3 px-6 block");
                }else if(enableCollapse === "block")
                {
                  setenableCollapse("hidden");
                  setCollapseShow("hidden");
                }
              }}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left  text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold px-0"
          
          >
            Menu
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
            </li>
            <li className="inline-block relative">
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col mt-16 md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >

   

            {/* Divider */}
            <hr className="mb-3 md:min-w-full" />
            {/* Heading */}
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={
                    "text-sm uppercase py-3 font-bold block " +
                    (window.location.href.includes("members") 
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/memberslist"
                >
                  <i
                    className={
                      "fas fa-user mr-2 text-xs " +
                      (window.location.href.includes("members") 
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  &nbsp;จัดการบัญชีผู้ใช้
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={
                    "text-sm uppercase py-3 font-bold block " +
                    (window.location.href.includes("learning")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/learninglist"
                >
                  <i
                    className={
                      "fas fa-book-open mr-2 text-xs " +
                      (window.location.href.includes("learning")
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  &nbsp;จัดการเส้นทางการเรียนรู้
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={
                    "text-sm uppercase py-3 font-bold block " +
                    (window.location.href.includes("courses")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/courseslist"
                >
                  <i
                    className={
                      "far fa-list-alt mr-2 text-xs " +
                      (window.location.href.includes("courses")
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  &nbsp;จัดการหลักสูตร
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
