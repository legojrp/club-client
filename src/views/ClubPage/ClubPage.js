import React , {useEffect, useContext, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom'
import axios from 'axios'
import AuthContext from "../../contexts/AuthContext"
import Navbar from '../../util/Navbar'

import ContactCard from'./ContactCard'
import GetInvolvedCard from './GetInvolvedCard'
import MemberList from './MemberList'
import Header from './Header'
import Error404 from '../../util/404'


import { Row, Col, Typography, Card, message} from 'antd';
import ClubContext from '../../util/ClubContext'
import UserClubContext from '../../contexts/UserClubContext'
const {Text} = Typography



const Club = ({history}) => {
    

    const {auth, setAuth} = useContext(AuthContext)
    console.log(auth)
    const {userClubContext, setUserClubContext} = useContext(UserClubContext)
    const {clubContext, setClubContext} = useContext(ClubContext)

    const clubURL = useParams().club
    const [club,setClub] = useState(null)
    const [clubMembers, setClubMembers] = useState(null)
    const [error, setError] = useState(false)

    const [autoJoined, setAutoJoined] = useState(false)
    const autojoin = (new URLSearchParams(useHistory().location.search)).get('autojoin')


    useEffect(() => {
       
        getClubData()

        if(autojoin && (auth.user && club)){
            // avoids hitting request twice
            if(!autoJoined){
                setAutoJoined(true)
                if(!club.officers.concat(club.members).concat(club.sponsors).includes(auth.user._id) ){
                    joinClub()
                } else {
                    message.error('Already In Club', 5)
                }
            }

        }
    }, [auth])

    const getClubData = async () => {
        try {

            if(clubContext && clubContext[clubURL]){
                setClub(clubContext[clubURL])
            } 
            const clubRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}`)
            const club = clubRes.data
            console.log(club)
            setClub(club)


            // const memberRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`)
            // setClubMembers(memberRes.data)
        } catch (err) {
            setError(true)
        }
    }




    const joinClub = async () => {
        try {
            console.log()
            const msId = auth.user.localAccountId; // Add your string here

            const clubRes = await axios.post(
              `${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`,
              { msId } // Send the string in the request body
            );
            setClub(clubRes.data)
            setClubContext({...clubContext, [clubURL]: clubRes.data})

            if(clubRes.data.applicants.includes(msId)){
                message.success('Application Sent', 5)

            
            } else {
                message.success('Successfully Joined', 5)
            }
            
            updateUserClubs()
            fetchClubMembers()

        } catch (err) {
            console.log(err)
            message.error('An error occured joining', 5)
        }
    }

    const leaveClub = async () => {
        try{
            const msId = auth.user.localAccountId;
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/`, {
                headers: {
                    'x-user-id': msId
                }
            });
            message.success('Successfully Left Club', 5)
            setClub(clubRes.data)

            updateUserClubs()
            fetchClubMembers()

        } catch(err){
            message.error('An error occured leaving', 5)
        }
    }


    const updateUserClubs = async () => {
        const userClubs = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/clubs`)
        setUserClubContext(userClubs.data)

    }

    const fetchClubMembers = async () => {
        const memberRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`)
        setClubMembers(memberRes.data)
    }

    return(
        <>
            <Navbar></Navbar>
            {error &&
            <Error404 resource="club"/>
            }
            {club && 
            <Row style={{background: "#fafcff", height:"100vh"}}>
            
                <Col span={22} style={{marginTop: "40px"}} offset={1}>
                    <Header club={club} leaveClub={leaveClub} joinClub={joinClub} history={history}/>
                    <div style={{margin:"20px 40px 0px 48px", display:"flex", justifyContent:"space-between"}}>
                        <div style={{width: "70%", marginRight:"2.5%"}}>

                            <Card hoverable  title="Description"style={{ borderRadius: "20px", marginBottom: "20px"}}>
                                <Text>{club.description}</Text>
                            </Card>

                            
                            {clubMembers && 
                            <MemberList club={club} clubMembers={clubMembers} ></MemberList>
                            }

                        </div>
                        <div style={{width: "27.5%", minWidth: "275px"}}>
                            
                            <GetInvolvedCard club={club}></GetInvolvedCard>
                            <ContactCard club={club}></ContactCard>

                        </div>
                    </div>
                </Col>
            </Row>
            }
        </>
    )
}

export default Club;