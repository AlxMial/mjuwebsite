import React,{useState,useEffect} from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import axios from "axios";
import urlPath from "services/urlServer";
// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import Frontend from "layouts/Frontend.js"
import { AuthContext } from "./services/AuthContext";
import Landing from "views/Landing";
// views without layouts

function App() {
    const [authState, setAuthState] = useState({
      email: "",
      id: 0,
      status: false,
      role:"",
      profilePicture:"",
      learningPathId:""
    });

    useEffect(() => {
          axios
            .get(urlPath+"/users/auth", {
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
                  role:response.data.role,
                  profilePicture:response.data.profilePicture,
                  learningPathId:response.data.learningPathId
                });
              }
            });
      
    }, []);

    return (
      <div className="App">
        <AuthContext.Provider value={{ authState, setAuthState }}>
            <BrowserRouter>
                <ToastProvider>
                  <Switch>
                      <Route path="/admin" component={Admin} />
                      <Route path="/auth" component={Auth} />
                      <Route path="/home" component={Frontend} />
                      <Route path="/landing" component={Landing} />
                      <Redirect from="*/" to="/auth/login" />
                  </Switch>
                </ToastProvider>
            </BrowserRouter>
        </AuthContext.Provider>
      </div>
    )
}

export default App;