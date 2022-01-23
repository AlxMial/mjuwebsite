// components
import React,{useRef,useState,useEffect} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
// Layout
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import AdminTopNavBar from "components/Navbars/AdminTopNavBar.js";

// views
import Members from "views/admin/MembersInfo";
import MembersList from "views/admin/MembersList";
import Learning from "views/admin/LearningInfo";
import LearningList from "views/admin/LearningList";
import Courses from "views/admin/CoursesInfo";
import CoursesList from "views/admin/CoursesList";

export default function Admin() {
  const box = useRef(null);
  useOutsideAlerter(box);

  const [todos, setTodos] = useState("");
  let history = useHistory();

  useEffect(() => {

    if(!localStorage.getItem("accessToken")){
      history.push("/auth/login");
    }

    const roleUser = localStorage.getItem("roleUser");
    if(roleUser !== "1")
      history.push("/home");

    if(window.location.pathname.includes("members"))
      setTodos("จัดการบัญชีผู้ใช้")
    else if(window.location.pathname.includes("learning"))
      setTodos("จัดการเส้นทางการเรียนรู้")
    else 
      setTodos("จัดการหลักสูตร")
     
  });

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if(window.location.pathname.includes("members"))
            setTodos("จัดการบัญชีผู้ใช้")
          else if(window.location.pathname.includes("learning"))
            setTodos("จัดการเส้นทางการเรียนรู้")
          else 
            setTodos("จัดการหลักสูตร")
        }
      }
      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  return (
    <>
      <AdminTopNavBar fixed />
      <Sidebar />
      <div className="relative md:ml-64"  ref={box}>
        <AdminNavbar title={todos}/>
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-44" >
          <Switch>
            <Route path="/admin/members" exact component={Members} />
            <Route path="/admin/members/:id" exact component={Members} />
            <Route path="/admin/memberslist" exact component={MembersList} />
            <Route path="/admin/learning" exact component={Learning} />
            <Route path="/admin/learning/:id" exact component={Learning} />
            <Route path="/admin/learninglist" exact component={LearningList} />
            <Route path="/admin/courses" exact component={Courses} />
            <Route path="/admin/courses/:id" exact component={Courses} />
            <Route path="/admin/courseslist" exact component={CoursesList} />
            <Redirect from="/admin" to="/admin/memberslist" />
          </Switch>
        </div>
      </div>
    </>
  );
}


