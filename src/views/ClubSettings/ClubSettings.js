import React , {useState, useContext, useEffect, useReducer} from 'react';
import Navbar from '../../util/Navbar'
import {useParams} from 'react-router-dom'
import { Modal ,Row, Col, Typography, PageHeader, Card, Select, Upload, Avatar, Menu, Badge, Button, Input, Divider, message, List, Tooltip, Switch, Popconfirm} from 'antd';
import { PlusOutlined,NotificationOutlined, TeamOutlined, HomeOutlined, CloseOutlined, LogoutOutlined, SearchOutlined, UploadOutlined, UserAddOutlined, LinkOutlined, InstagramOutlined, MailOutlined} from '@ant-design/icons';import { UserDeleteOutlined} from '@ant-design/icons';
import AuthContext from '../../contexts/AuthContext'
import {motion} from 'framer-motion'
import axios from 'axios'
import ClubContext from '../../util/ClubContext';
import UserClubContext from '../../contexts/UserClubContext'
import moment from 'moment'
import TagSelector from '../SharedComponents/TagSelctor';
import AvatarUpload from '../SharedComponents/AvatarUpload'
import SettingsNav from '../SharedComponents/SettingsNav'


import InformationMenu from './InformationMenu'
import AnnouncementMenu from './AnnouncementMenu'
import ApplicationMenu from './ApplicationMenu'
import MemberMenu from './MemberMenu'


const {SubMenu} = Menu

const {Title , Text, Paragraph} = Typography


const ClubSettings = ({history}) => {

    const clubURL = useParams().club
    


    const {auth, setAuth} = useContext(AuthContext)
    const {clubContext, setClubContext} = useContext(ClubContext)
    const [activeKey, setActiveKey] = useState("info")
 
    const [club,setClub] = useState(null)
    const [clubMembers, setClubMembers] = useState(null)
    const [announcements, setAnnouncements] = useState(null)

    const [menu,setMenu] = useState("info")




    const [form, setForm] = useState()
    const [errors,setErrors] = useState([])
    const [edited,setEdited] = useState(false)

    const {userClubContext, setUserClubContext} = useContext(UserClubContext)


    const getClub = async () => {
        try {

            if(clubContext[clubURL]){
                setClub(clubContext[clubURL])
            } else {
                const clubRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}`)
                setClub(clubRes.data)
            }

            const memberRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members`)
            const announcementRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/announcement`)
            setClubMembers(memberRes.data)
            setAnnouncements(announcementRes.data.announcements.reverse())

        } catch (err) {

            history.push('/')
            console.log(err.msg)

        }
    }


    const userHasAuthPerms = () => {
        return club.officers.includes(auth.user._id) || club.sponsors.includes(auth.user._id)
    }



    useEffect(() => {

        if(!club){
            getClub()
        } else {
            console.log(club)
            if(!auth.user && !auth.isLoading){
                history.push('/')
            } else if(userHasAuthPerms()) {
                setForm({
                    name: club.name || "",
                    class: auth.user.class || "",
                    logo: club.logo || "",
                    description: club.description || "",
                    getInvolved: club.getInvolved || "",
                    tagline: club.tagline || "",
                    color: club.color || "",
                    contact: club.contact || {},
                    tags: club.tags || [],
                    titles: club.titles || [],
                    members: club.members || [],
                    sponsors: club.sponsors || [],
                    officers: club.officers || [],
                    settings: club.settings || {}
                })  
            } else {
                history.push('/')
            }
    
        }

       

    }, [auth, club, clubMembers])

    const updateClub = async () => { 

        try{

            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/`, form)

            const club = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : club})

            setErrors([])
            setEdited(false)
            message.success('Club information updated', 5)

        } catch(err) {

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])

        }
    }
    
    const leaveClub = async () => {
        console.log("h")
        try{
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/`)
            history.push('/')
            setClub(clubRes.data)
            setUserClubContext(UserClubContext.filter((club) => club.url != clubURL ))
            message.success('Successfully Left Club', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }

    const disbandClub = async () => {
        try{
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/`)
            history.push('/')
            setUserClubContext(UserClubContext.filter((club) => club.url != clubURL ))

            let temp = clubContext

            delete temp[clubURL]

            setClubContext(temp)
            message.success('Successfully Disbanded Club', 5)

        } catch(err){

            console.log(err)
            setErrors([{"msg": "Server error"}])
        }
    }
    return(
        <>
        <Navbar></Navbar>
        <Row style={{background: "#fafcff", height:"100vh"}}>
           
            <Col span={18} offset={3}>
            { (club && auth.user) && <>
            <PageHeader
                style={{marginTop: "40px"}}
                className="site-page-header"
                onBack={() => history.push('/')}
                title={
                    <div>
                        <Title level={2} style={{marginBottom:"0px"} } > Manage Club</Title>
                     
                     
                    </div>
                }
                extra={[
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Text>{club.name}</Text>
                        <Divider type="vertical" />
                        <Text style={{margin: "0px"}}>{ club.sponsors.includes(auth.user._id) ? club.titles[auth.user._id] || "Sponsor" : club.titles[auth.user._id] || "Officer" }</Text>
                        <Divider type="vertical" />
                        <Avatar size={35}  shape="square"  src={form?.logo || club.logo}></Avatar>
                    </div>
                ]}
            />
                <div style={{margin:"20px 40px 0px 48px", display:"flex", justifyContent:"space-between"}}>
                    <div style={{width: "20%", minWidth: "275px", marginBottom: "40px"}}>
                        <SettingsNav
                            onClick={(e) => {
                                setActiveKey(e.key)
                                if(e.key == 'leave'){
                                    leaveClub()
                                } else if(e.key == 'disband'){
                                    disbandClub()
                                }
                            }}
                        >
                            <Menu.Item key="info" onClick={() => setMenu('info')}style={activeKey == "info" && {color: "#1890ff"} }icon={<HomeOutlined />}>Club Information</Menu.Item>
                            <Menu.Item key="members" onClick={() => setMenu('members')} style={activeKey == "members" && {color: "#1890ff"} }icon={<TeamOutlined />}>Members</Menu.Item>
                            <Menu.Item key="app" onClick={() => setMenu('app')} style={activeKey == "app" && {color: "#1890ff"} }icon={<UserAddOutlined />}><Badge offset={[1,2]} dot={club.applicants.length > 0}>Applicants </Badge>  </Menu.Item>
                            <Menu.Item key="announcements" onClick={() => setMenu('announcements')} style={activeKey == "announcements" && {color: "#1890ff"} }icon={<NotificationOutlined />}>Announcments  </Menu.Item>

                            {club.officers.includes(auth.user._id) &&
                            <Menu.Item danger key='leave' onClick={() => leaveClub()} style={activeKey == "leave" && {color: "#1890ff"} }icon={<LogoutOutlined />}>Leave Club </Menu.Item>
                            }
                            {club.sponsors.includes(auth.user._id) &&
                            <Menu.Item danger key='disband' onClick={() => disbandClub} icon={<LogoutOutlined />}>Disband Club </Menu.Item>
                            }
                        </SettingsNav>
                    </div>

                    <div style={{width: "75%", marginLeft:"2.5%"}}>
                            <Card  style={{ borderRadius: "20px", marginBottom: "20px"}}>
                                {auth.user && form && 
                                <>
                                    {
                                        {
                                        "announcements": <AnnouncementMenu club={club} auth={auth} announcements={announcements} setAnnouncements={setAnnouncements}/>,
                                        "info": <InformationMenu errors={errors}  setErrors={errors} form={form} updateClub={updateClub} setForm={setForm} edited={edited} setEdited={setEdited}/>,
                                        "app": <ApplicationMenu edited={edited} club={club} setErrors={setErrors} setClubMembers={setClubMembers} errors={errors} updateClub={updateClub} setClub={setClub} form={form} setForm={setForm} clubMembers={clubMembers} setEdited={setEdited} />,
                                        "members": <MemberMenu form={form} errors={errors} edited={edited} setEdited={setEdited} clubMembers={clubMembers} setForm={setForm} club={club} updateClub={updateClub} setErrors={setErrors} setClub={setClub} setClubMembers={setClubMembers}/>
                                        }[menu]
                                    }
                                </>
                                }
                            </Card>
                    </div>
                </div>
            </>}
            </Col>
        </Row>
        </>
    )
}

export default ClubSettings;