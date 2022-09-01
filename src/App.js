import { Button, Modal, notification, Typography } from "antd";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import Error404 from "./util/404";
import Navbar from "./util/Navbar";
import ClubBrowse from "./views/ClubBrowse/ClubBrowse";
import ClubCreate from "./views/ClubCreate";
import Club from "./views/ClubPage/ClubPage";
import ClubSettings from "./views/ClubSettings/ClubSettings";
import Settings from "./views/Settings";

import AuthContext from "./contexts/AuthContext";
import UserClubContext from "./contexts/UserClubContext";
import ClubContext from "./util/ClubContext";

import ForgotPassword from "./views/ForgotPassword";
import Login from "./views/Login";
import ResetPassword from "./views/ResetPassword";
import Signup from "./views/Signup";
import Verify from "./views/Verify";

import EmailModal from "./util/EmailModal";

const { Text, Link } = Typography;

const notifContent = () => {
  return (
    <Text>
      Have a feature you want? Found a bug? Please provide any feedback to us
      here
      <Link href="https://ant.design" target="_blank">
        Ant Design
      </Link>
    </Text>
  );
};

const App = () => {
  const [auth, setAuth] = useState({ isAuth: false });
  const [clubContext, setClubContext] = useState(null);
  const [shownNotif, setShownNotif] = useState(false);
  const [userClubContext, setUserClubContext] = useState(null);

  console.log(`${process.env.REACT_APP_CLUB_API}`);

  useEffect(() => {
    document.title = "HSE Clubs";

    if (!auth.user) {
      testToken();
    }
    if ((!auth.isAuth || auth.loading) && localStorage.getItem("token")) {
      console.log("test token");
      testToken();
    }

    if (
      auth.isAuth &&
      !auth.loading &&
      (!auth.name || !auth.phone || !auth.class)
    ) {
    }
  }, [auth]);

  const testToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("no token");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        console.log("getting user data");
        const res = await axios.get(
          `${
            process.env.REACT_APP_CLUB_API
          }/user/?timestamp=${new Date().getTime()}`
        );
        console.log("respone");
        console.log(res.data);
        if (!res.data.errors) {
          setAuth({ isAuth: true, user: res.data });
          console.log("authed");
        } else {
          console.log("failed");
          localStorage.removeItem("token");
          setAuth({ isAuth: false });
        }
      } catch (err) {
        localStorage.removeItem("token");
        console.log(err.msg);
        setAuth({ isAuth: false });
      }
    }
  };

  return (
    <UserClubContext.Provider value={{ userClubContext, setUserClubContext }}>
      <ClubContext.Provider value={{ clubContext, setClubContext }}>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ClubBrowse} />
              <Route exact path="/verify/:token" component={Verify} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route
                exact
                path="/reset-password/:token"
                component={ResetPassword}
              />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/clubs/:club" component={Club} />
              <Route
                exact
                path="/clubs/:club/settings"
                component={ClubSettings}
              />
              <Route exact path="/team"></Route>
              <Route exact path="/faq"></Route>
              <Route exact path="/contact"></Route>
              <Route exact path="/create" component={ClubCreate}></Route>
            </Switch>
            <EmailModal testToken={testToken} />
          </BrowserRouter>
        </AuthContext.Provider>
      </ClubContext.Provider>
    </UserClubContext.Provider>
  );
};

export default App;
