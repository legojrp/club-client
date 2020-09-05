import React , {useEffect, useContext, useState} from 'react';
import {useParams, Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../auth/AuthContext'
import Navbar from '../util/Navbar'
import { Row, Col, Typography, PageHeader, Card, Modal, Button, message, Avatar} from 'antd';
import { LinkOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined, InstagramOutlined, MailOutlined, VideoCameraOutlined } from '@ant-design/icons';
import error404 from '../img/404.svg'
import indiana from '../img/indiana.png'
import {motion} from 'framer-motion'
import ClubContext from '../util/ClubContext'
import UserClubContext from '../util/UserClubContext'
const {Title, Text} = Typography

const clubData =  {
    "clubName":"Indiana Hax",
    "clubURL":"indiana-hax",
    "clubDescription":"Hosting hackathons and competitive programming competitions",
    "clubColor":"#f89e9b",
    "clubTags":["Engineering", "Computer Science", "Software"],
    "clubLogo":indiana,
    "clubMemberCount": 20,
    "clubSize": "Small",
    "clubRole": "admin"
}

const Club = ({history}) => {

    const {auth, setAuth} = useContext(AuthContext)

    const[phoneModal, setPhoneModal] = useState(false)


    const [club,setClub] = useState(null)


    const [clubMembers, setClubMembers] = useState(null)

    const [autoJoined, setAutoJoined] = useState(false)
    
    const [error, setError] = useState(false)
    const clubURL = useParams().club
    const {clubContext, setClubContext} = useContext(ClubContext)
    
    const autojoin = (new URLSearchParams(useHistory().location.search)).get('autojoin')

    const {userClubContext, setUserClubContext} = useContext(UserClubContext)



    const test = async () => {
        try {

            if(clubContext && clubContext[clubURL]){
                setClub(clubContext[clubURL])
            } 
            const clubRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}`)
            const club = clubRes.data
            console.log(club)
            setClub(club)


            const memberRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`)
            setClubMembers(memberRes.data)
        } catch (err) {
            if(err.response?.data?.errors){
                console.log(err.response.data.errors)
                setError(true)
            } else {
                setError(true)
            }
        }
    }



    useEffect(() => {
       
        test()

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





    const joinClub = async () =>{
        try{
            const clubRes = await axios.post(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/`)

            setClub(clubRes.data)
            setClubContext({...clubContext, [clubURL]: clubRes.data})

            if(clubRes.data.applicants.includes(auth.user._id)){
                message.success('Application Sent', 5)

            } else {
                message.success('Successfully Joined', 5)
            }


            if(!auth.user.phone){
                setPhoneModal(true)
            }


            const memberRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`)
            setClubMembers(memberRes.data)

            const userClubs = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/clubs`)
            setUserClubContext(userClubs.data)


        } catch (err) {

            console.log(err)
        }
    }

    const leaveClub = async () => {
        console.log("h")
        try{
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/`)
            message.success('Successfully Left Club', 5)
            setClub(clubRes.data)

            const memberRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`)
            setClubMembers(memberRes.data)

            const userClubs = await axios.get(`${process.env.REACT_APP_CLUB_API}/user/clubs`)
            setUserClubContext(userClubs.data)



        } catch(err){

            console.log(err.msg)
        }
    }

    const z = () => {
        if(!auth.user || !club){
            return[         
                <Text> <Link to={`/login?redirect=/clubs/${club.url}?autojoin=true`}>Join Club</Link></Text>,
                <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
            ]
        } else {
            const userIsMember = club.members.includes(auth.user._id)
            const userIsOfficer = club.officers.includes(auth.user._id)
            const userisSponser = club.sponsors.includes(auth.user._id)
            const userIsApplicant = club.applicants.includes(auth.user._id)
            if(userIsMember){
                return[         
                    <Link><Text type="danger" onClick={leaveClub}> Leave Club</Text></Link>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            } else if (userIsOfficer || userisSponser){
                return[         
                    <Text> <Link to={`/clubs/${clubURL}/settings`}> Manage Club</Link></Text>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            } else if (userIsApplicant){
                return[         
                    <Text>Pending Application</Text>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            } else {
                return[         
                    <Text> <Link onClick={() => joinClub()}> Join Club</Link></Text>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            }

        }
    }
    
    return(
        <>
        <Navbar></Navbar>
        {error &&
            <Row style={{background: "#fafcff", height:"calc(100vh - 61px)"}}>
           
            <Col span={22} style={{}} offset={1}>
            <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <motion.img initial={{ scale: 0}} animate={{ scale: 1}} transition={{duration: 0.4, type: "spring"}} src={error404} style={{width: "80%", maxWidth: "450px", marginBottom: "50px"}}></motion.img>
                <Text type="secondary" style={{fontSize: "16px", textAlign:"center"}}> The club you are looking for doesn't exist <br/><Link to="/">Go back to home</Link></Text>
            </div>
            </Col>
        </Row>
        }
        {club && 
        <Row style={{background: "#fafcff", height:"100vh"}}>
           
            <Col span={22} style={{marginTop: "40px"}} offset={1}>
            <PageHeader
                 className="site-page-header"
                 onBack={() => history.push('/')}
                 title={
                     <div>
                         <Title level={2} style={{marginBottom:"0px"} } > {club.name}</Title>
                      
                      
                     </div>
                 }
                 extra={z()}
                 >

            </PageHeader>
                <div style={{margin:"20px 40px 0px 48px", display:"flex", justifyContent:"space-between"}}>
                    <div style={{width: "70%", marginRight:"2.5%"}}>
                    <Card hoverable   title="Description"style={{ borderRadius: "20px", marginBottom: "20px"}}>
                        <Text>{club.description}</Text>

                    </Card>
                    <div style={{width: "100%", display: "flex", flexWrap: 'wrap'}}>
                        {clubMembers && clubMembers.sponsors.map((member) => {

                            return (<Card hoverable style={{borderRadius: "20px", marginRight: "20px",marginBottom:'10px', width: "20%"}}>
                            <div style={{display: "flex", alignItems:"center",width: "100%", flexDirection: "column"}}>
                                    <Avatar size={60} style={{background: clubData.color, marginBottom: "15px"}} src={member.profilePictureURL}></Avatar>
                                    <Title style={{fontSize: "1.1em", textAlign: "center"}} level={4}> {member.name} </Title>
                                    <Text style={{textAlign:'center'}}> {club.titles[member._id] ? club.titles[member._id] : "Sponsor"} </Text>
                            </div>
                            </Card>)
                        })}
                         {clubMembers && clubMembers.officers.map((member) => {


                            return (<Card hoverable style={{borderRadius: "20px", marginRight: "20px",marginBottom:'10px', width: "20%"}}>
                            <div style={{display: "flex", alignItems:"center",width: "100%", flexDirection: "column"}}>
                                    <Avatar size={60} style={{background: clubData.color, marginBottom: "15px"}} src={member.profilePictureURL}></Avatar>
                                    <Title style={{fontSize: "1.1em", textAlign: "center"}} level={4}> {member.name} </Title>
                                    <Text style={{textAlign:'center'}}> {club.titles[member._id] ? club.titles[member._id] : "Officer"} </Text>
                            </div>
                            </Card>)
                        })}
                        {clubMembers && clubMembers.members.map((member) => {

                             return (<Card hoverable style={{borderRadius: "20px", marginRight: "20px",marginBottom:'10px', width: "20%"}}>
                                        <div style={{display: "flex", alignItems:"center",width: "100%", flexDirection: "column"}}>
                                                <Avatar size={60} style={{background: clubData.color, marginBottom: "15px"}} src={member.profilePictureURL}></Avatar>
                                                <Title style={{fontSize: "1.1em", textAlign: "center"}} level={4}> {member.name} </Title>
                                                <Text style={{textAlign:'center'}}> {club.titles[member._id] ? club.titles[member._id] : "Member"} </Text>
                                        </div>
                                     </Card>)
                        })}
                       
                    </div>
                    </div>


                    <div style={{width: "27.5%", minWidth: "275px"}}>

{/* 
                        <Card hoverable title="Info" style={{ borderRadius: "20px", marginBottom: "20px"}}>
                            <p><UserOutlined style={{marginRight: "10px"}} />{club.officers.length + club.members.length} Members </p>
                            <p><CalendarOutlined style={{marginRight: "10px"}} /> Active all year</p>
                            <p><ClockCircleOutlined style={{marginRight: "10px"}} /> Every wednesday at 3:30PM</p>

                        </Card> */}


                        <Card hoverable title="Get Involved" style={{ borderRadius: "20px", marginBottom: "20px"}}>
                            <p>{club.getInvolved}</p>
                            {club.contact?.zoom &&
                            <p><VideoCameraOutlined style={{marginRight: "10px"}} /> <a target="_blank" href={club.contact.zoom}>Club Zoom Link</a></p>
                            }


                        </Card>
                        <Card hoverable title="Contact" style={{ borderRadius: "20px", marginBottom: "20px"}}>
                            { club?.contact?.website &&
                            <p><LinkOutlined style={{marginRight: "10px"}} /> <a target="_blank" href={`https://${club.contact.website}`}> {club.contact.website} </a> </p>
                            }
                            {club.contact?.instagram &&
                            <p><InstagramOutlined style={{marginRight: "10px"}} /> <a target="_blank" href={`https://instagram.com/${club.contact.instagram}`}> @{club.contact.instagram} </a></p>

                            }
                            {club.contact?.email &&
                            <p><MailOutlined style={{marginRight: "10px"}} /> <Link>{club.contact.email}</Link></p>
                            }

                        </Card>
                    </div>
                </div>


            

           

                
              
            </Col>
        </Row>
        }


        <Modal vis></Modal>
        </>
    )
}

export default Club;