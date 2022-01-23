import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AdminTopNavBar from "components/Navbars/AdminTopNavBar.js";
import home from 'views/frontend/home/home.js';
import Curriculum from 'views/frontend/curriculum/curriculum.js';
import subject from 'views/frontend/subject/subject.js';
import Account from 'views/frontend/account/account.js';
import content from 'views/frontend/content/content.js';
import { AuthContext } from "../services/AuthContext";
import urlPath from "services/urlServer";
export default function Frontend() {
  const history = useHistory();
  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    status: false,
    role: "",
    profilePicture: "",
    learningPathId: ""
  });
  const roleUser = localStorage.getItem("roleUser");
  if (roleUser === null) { history.push("/auth/login"); }

  useEffect(() => {
    axios
      .get(urlPath + "/users/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            email: response.data.email,
            id: response.data.id,
            status: true,
            role: response.data.role,
            profilePicture: response.data.profilePicture,
            learningPathId: response.data.learningPathId
          });
        }
      });

  }, []);

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <AdminTopNavBar fixed />
        <Switch>
          <Route path="/home/index" exact component={home} />
          <Route path="/home/curriculum/:id" exact component={Curriculum} />
          <Route path="/home/subject/:id" exact component={subject} />
          <Route path="/home/content/:id" exact component={content} />
          <Route path="/home/account" exact component={Account} />
          <Redirect from="/home" to="/home/index" />
        </Switch>
      </AuthContext.Provider>
    </>
  )
}