import React, { useEffect, useState, useContext} from 'react'
import {Link} from 'react-router-dom'

import AnnouncementModal from './AnnouncementModal'
import MakeAnnouncementModal from './MakeAnnouncementModal'


import {Menu, Switch, List, Badge, Avatar, Dropdown, Tooltip, message, Typography, Card} from 'antd'

import { NotificationOutlined, SettingOutlined, MoreOutlined, UserDeleteOutlined, BellOutlined,} from '@ant-design/icons';


import axios from 'axios'

import AuthContext from "../../auth/AuthContext"
import UserClubContext from '../../util/UserClubContext';


const {Text} = Typography


const MyClubsCard = ({history}) => {

    const {auth, setAuth} = useContext(AuthContext)
    const {userClubContext, setUserClubContext} = useContext(UserClubContext)
    const [userClubs, setUserClubs] = useState(null)
    const [clubAnnouncements, setClubAnnouncements] = useState(null)


    const[aModal, setAModal] = useState({open : false})
    const[modal, setModal] = useState({open : false})

    useEffect(() => {
        if(!userClubs){
            getUserClubs()
        }
    }, [])

    const getUserClubs = async () => {
        try{
            if(userClubContext){
                setUserClubs(userClubContext)
            }

            const userClubs = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/clubs`)
            
            const announcements = {}

            await userClubs.data.forEach(async (club) => {
                let announcementRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/announcement`)

                let temp = announcementRes.data 
                temp.announcements.reverse()

                announcements[club.url] = temp
                setClubAnnouncements({...announcements})
            })




            setUserClubs(userClubs.data)
            setUserClubContext(userClubs.data)

        } catch (err) {
            if(err.response?.data?.errors){
                console.log(err.response.data.errors)
            } else {
                console.log(err)
            }

        }
    }


    const markRead = async (clubURL) => {

        try {
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/announcement`)

            setUserClubs([...userClubs.filter((club) => club.url != clubURL), clubRes.data])

        } catch (err) {
            
        }


    }

    const leaveClub = async (clubURL) => {
        try{
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/`)
            

            const userClubs = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/clubs`)
            setUserClubs(userClubs.data)

            setUserClubContext(userClubs.data)

            message.success('Successfully Left Club', 5)

        } catch(err){

            console.log(err.msg)
        }
    }

    const changeSMS = async (clubURL) => {
        try{

            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/settings/sms`)

            message.success('SMS Preferences Updated', 5)

            const userClubs = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/clubs`)
            setUserClubs(userClubs.data)
            setUserClubContext(userClubs.data)



        } catch(err){

            message.error('Server Error', 5)
        }
    }




    
    return(
        <>

        <AnnouncementModal clubAnnouncements={clubAnnouncements} aModal={aModal} setAModal={setAModal}/>
        <MakeAnnouncementModal modal={modal} setModal={setModal}/>

        {userClubs && 
        <Card title="My Clubs" bordered={true} extra={ auth.user.role == "teacher" &&[<Link to='/create'>Register Club</Link>]} style={{ width: "100%", margin: "40px 20px ", borderRadius: "20px" }}>
        <List
            itemLayout="horizontal"
            dataSource={userClubs}
            renderItem={(club) => {
            let actions = []


            let newAnnouncement = false;
            let userLastViewDate;

            try{
                userLastViewDate = club.announcementViewDate[auth.user._id]
            } catch(err){
                userLastViewDate = 1
            }
                if(clubAnnouncements){
                    if(clubAnnouncements[club.url]){
                            newAnnouncement = clubAnnouncements[club.url].announcements.some((announcement) => {
                                return Date.parse(announcement.date) > userLastViewDate
                            })
                    
                    }
                }


            if(club.officers.includes(auth.user._id) || club.sponsors.includes(auth.user._id)){
                if(club.officers.includes(auth.user._id)){
                    actions = [
                        <Link><Tooltip title="Announcements"><Badge dot={newAnnouncement || false} offset={[-3,1]}><BellOutlined onClick={() => {
                            markRead(club.url)
                            setAModal({open: true, club: club})
                        }} style={{color:"rgba(0, 0, 0, 0.45)"}}/></Badge></Tooltip></Link>,
                        <Link ><Tooltip title="Make Announcement"><Badge><NotificationOutlined onClick={() => setModal({open: true, club})} style={{color:"rgba(0, 0, 0, 0.45)"}}/></Badge></Tooltip></Link>,
                        <Link to={`/clubs/${club.url}/settings`}> <Badge dot={club.applicants.length >= 1} offset={[-2,1]}><Tooltip title="Settings"><SettingOutlined style={{color:"rgba(0, 0, 0, 0.45)"}}/></Tooltip> </Badge></Link>,
                      
            
                    ]
                } else {
                    actions = [
                        <Link ><Tooltip title="Make Announcement"><Badge><NotificationOutlined onClick={() => setModal({open: true, club})} style={{color:"rgba(0, 0, 0, 0.45)"}}/></Badge></Tooltip></Link>,
                        <Link to={`/clubs/${club.url}/settings`}> <Badge dot={club.applicants.length >= 1} offset={[-2,1]}><Tooltip title="Settings"><SettingOutlined style={{color:"rgba(0, 0, 0, 0.45)"}}/></Tooltip> </Badge></Link>,

                    ]
                }

            } else {
              
              
              
                
                actions = [
                    <Link><Tooltip title="Announcements"><Badge dot={newAnnouncement || false} offset={[-3,1]}><BellOutlined onClick={() => {
                        markRead(club.url)
                        setAModal({open: true, club: club})
                    }} style={{color:"rgba(0, 0, 0, 0.45)"}}/></Badge></Tooltip></Link>,
                    <Dropdown placement="bottomRight" overlay={
                        <Menu>
                        <Menu.Item key='sms' onClick={() => changeSMS(club.url)}>
                             Text Notifications 
                            <Switch  checked={!club.settings?.smsDisabled?.includes(auth.user._id)} style ={{marginLeft: "15px"}}size="small"></Switch>
                        </Menu.Item>
                        <Menu.Item style={{display:"flex", alignItems:"center",justifyContent:"space-between"}} danger onClick={() => leaveClub(club.url)}> 
                          Leave Club
                          <UserDeleteOutlined style={{ marginRight:"0px", fontSize:"13px"}}/>
                        </Menu.Item>
                  
                      </Menu>
                    }>
                    
                    <MoreOutlined style={{color:"rgba(0, 0, 0, 0.45)"}}/>
                    </Dropdown>
                ]
            }
            return (
            <List.Item
                actions={actions}
            >
                    <List.Item.Meta
                    style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    avatar={<Avatar style={{borderRadius: "10px"}} onClick={() => history.push(`/clubs/${club.url}`)} src={club.logo} />}
                    title={
                        <div onClick={() => history.push(`/clubs/${club.url}`)} style={{paddingTop:"4px", fontSize: "12px"}}>
                            <Text>{club.name}</Text>
                        </div>
                    }
                    />
            </List.Item>

            )}}
        />
    </Card>      
    }
    </>
    )
}

export default MyClubsCard