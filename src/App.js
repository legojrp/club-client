import React , {useEffect, useState} from 'react';
import {notification, Typography, Modal, Button} from 'antd'

import Settings from './views/Settings'
import axios from 'axios'
import Navbar from './util/Navbar'
import Error404 from './util/404'
import Club from './views/ClubPage/ClubPage'
import ClubBrowse from './views/ClubBrowse/ClubBrowse'
import ClubSettings from './views/ClubSettings'
import ClubCreate from './views/ClubCreate'
import {BrowserRouter,Switch, Route, useParams} from 'react-router-dom'

import AuthContext from './auth/AuthContext'
import ClubContext from './util/ClubContext'
import UserClubContext from './util/UserClubContext'

import Login from './auth/Login'
import Signup from './auth/Signup'
import Verify from './auth/Verify'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'


import EmailModal from './util/EmailModal'

const {Text, Link} = Typography

const notifContent =() => {
  return(
    <Text>     
      Have a feature you want? Found a bug? Please provide any feedback to us here
      <Link href="https://ant.design" target="_blank">Ant Design</Link>
    </Text>
  )
}




const App = () => {
  const [auth, setAuth] = useState({isAuth: false})
  const [clubContext, setClubContext] = useState(null)
  const [shownNotif, setShownNotif] = useState(false)
  const [userClubContext, setUserClubContext] = useState(null)



  console.log(`${process.env.REACT_APP_CLUB_API}`)



  useEffect(() => {
    document.title = "HSE Clubs"
    

    if(!auth.user){
      testToken()
    }
    if( (!auth.isAuth || auth.loading) && localStorage.getItem("token")){
      console.log("test token")
      testToken()
    }

    if ((auth.isAuth && !auth.loading) && (!auth.name || !auth.phone || !auth.class)){

    }

    if(!shownNotif && auth.isAuth){
      notification.open({
        message: 'Please provide beta feedback!',
        placement: "bottomRight",
        style: {borderRadius: "10px"},
        description: (
          <Text>     
          Have a feature you want? Found a bug? Please provide any feedback to us <Link href="https://airtable.com/shrJJ9EvbYFOKYXdX" target="_blank">here</Link>
        </Text>
        ),
        duration: "20"
      });






      setShownNotif(true)
    }

  }, [auth])


  const testToken = async () => {
    const token = localStorage.getItem('token')

    if(!token){
      console.log("no token")
    } else {
      axios.defaults.headers.common['Authorization'] =`Bearer ${token}`

      try{
        console.log("getting user data")
        const res = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/?timestamp=${new Date().getTime()}`)
        console.log('respone')
        console.log(res.data)
        if(!res.data.errors){
          setAuth({isAuth: true, user: res.data})
          console.log("authed")
        } else {
          console.log("failed")
          localStorage.removeItem("token")
          setAuth({isAuth: false})
        }
      } catch (err) {

        localStorage.removeItem("token")
        console.log(err.msg)
        setAuth({isAuth: false})
      }
    }
  }

  

  return (
    <UserClubContext.Provider value={{userClubContext, setUserClubContext}}>
      <ClubContext.Provider value={{clubContext, setClubContext}}>
        <AuthContext.Provider value={{auth, setAuth}}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ClubBrowse}/>
              <Route exact path="/verify/:token" component={Verify}/>
              <Route exact path="/forgot-password" component={ForgotPassword}/>
              <Route exact path="/reset-password/:token" component={ResetPassword}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/signup" component={Signup}/>
              <Route exact path="/settings" component={Settings}/>
              <Route exact path ="/clubs/:club" component={Club}/>
              <Route exact path ="/clubs/:club/settings" component={ClubSettings}/>
              <Route exact path="/team"></Route>
              <Route exact path="/faq"></Route>
              <Route exact path="/contact"></Route>
              <Route exact path="/create" component={ClubCreate}></Route>
            </Switch>
            <EmailModal testToken={testToken}/>
          </BrowserRouter>
        </AuthContext.Provider>
      </ClubContext.Provider>
    </UserClubContext.Provider>
   
  );
}

export default App;
