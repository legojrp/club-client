import { Button, Modal, notification, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./AuthConig"

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
// import Login from "./views/Login";
// import ResetPassword from "./views/ResetPassword";
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
  const [auth, setAuth] = useState({
    isAuth: false,
    loading: true,
    fetched: false,
  });
  const [clubContext, setClubContext] = useState(null);
  const [shownNotif, setShownNotif] = useState(false);
  const [userClubContext, setUserClubContext] = useState(null);
  const { instance, accounts } = useMsal();
  console.log(`${process.env.REACT_APP_CLUB_API}`);

  useEffect(() => {
    document.title = "HSE Clubs";
    if (accounts[0]) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          const resp = {...response.account, grade: parseInt(response.account.grade)}
          setAuth((prev) => ({
            ...prev,
            token: response.accessToken,
            user: resp,
          }));

          testToken(response.accessToken);
        });
    }
    // if (!auth.user) {
    //   testToken();
    // }
    // if ((!auth.isAuth || auth.loading) && localStorage.getItem("token")) {
    //   console.log("test token");
    //   testToken();
    // }

    // if (
    //   auth.isAuth &&
    //   !auth.loading &&
    //   (!auth.name || !auth.phone || !auth.class)
    // ) {
    // }
  }, [accounts]);


  async function signOutClickHandler(instance) {
    const selectionRes = await axios.post(
      `${process.env.REACT_APP_CLUB_API}/user`,
      {
        user: auth,
      }
    );
    console.log(selectionRes, "SELECTION RES");
    if (!selectionRes.data.errors) {
      setAuth((prev) => ({
        isAuth: true,
        user: { ...prev.user },
        loading: false,
        fetched: true,
      }));
    }
  
  }

  const testToken = async (token) => {
    const res = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (
      res.data.jobTitle == "12" ||
      res.data.jobTitle == "11" ||
      res.data.jobTitle == "10" ||
      res.data.jobTitle == "9"
    ) {

      setAuth((prev) => ({
        ...prev,
        isAuth: true,
        loading: false,
        fetched: false,
        user: {
          ...prev.user,
          role: "student",
          displayName: `${res.data.givenName} ${res.data.surname}`,
          grade: res.data.jobTitle,
        },
      }));
      console.log(auth);
    }
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   console.log("no token");
    // } else {
    //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    //   try {
    //     console.log("getting user data");
    //     const res = await axios.get(
    //       `${
    //         process.env.REACT_APP_CLUB_API
    //       }/user/?timestamp=${new Date().getTime()}`
    //     );
    //     console.log("respone");
    //     console.log(res.data);
    //     if (!res.data.errors) {
    //       setAuth({ isAuth: true, user: res.data });
    //       console.log("authed");
    //     } else {
    //       console.log("failed");
    //       localStorage.removeItem("token");
    //       setAuth({ isAuth: false });
    //     }
    //   } catch (err) {
    //     localStorage.removeItem("token");
    //     console.log(err.msg);
    //     setAuth({ isAuth: false });
    //   }
    // }
  };

//  useEffect(async () => {
  
//     if (auth.user && !auth.fetched) {
//       console.log("FETCHING");
//       const selectionRes = await axios.post(
//         `${process.env.REACT_APP_CLUB_API}/user`,
//         {
//           user: auth,
//         }
//       );
//       console.log(selectionRes, "SELECTION RES");
//       if (!selectionRes.data.errors) {
//         setAuth((prev) => ({
//           isAuth: true,
//           user: { ...prev.user },
//           loading: false,
//           fetched: true,
//         }));
//       }
//     }
   
//   }, [auth]);

useEffect(() => {
  const fetchData = async () => {
    if (auth.user && !auth.fetched) {
      console.log("FETCHING");
      try {
        const selectionRes = await axios.post(
          `${process.env.REACT_APP_CLUB_API}/user`,
          {
            user: auth,
          }
        );
        console.log(selectionRes, "SELECTION RES");
        if (!selectionRes.data.errors) {
          setAuth((prev) => ({
            isAuth: true,
            user: { ...prev.user },
            loading: false,
            fetched: true,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  fetchData();
}, [auth]);

 

  console.log(auth.user);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
    <UserClubContext.Provider value={{ userClubContext, setUserClubContext }}>
      <ClubContext.Provider value={{ clubContext, setClubContext }}>
      <button onClick={() => signOutClickHandler(instance)}IFNIJNEINFE></button>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ClubBrowse} />
     
            
            
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
          </BrowserRouter>
       
      </ClubContext.Provider>
    </UserClubContext.Provider>
     </AuthContext.Provider>
  );
};

export default App;
