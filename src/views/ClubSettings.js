import React , {useState, useContext, useEffect} from 'react';
import Navbar from '../util/Navbar'
import {useParams} from 'react-router-dom'
import { Modal ,Row, Col, Typography, PageHeader, Card, Select, Upload, Avatar, Menu, Badge, Button, Input, Divider, message, List, Tooltip, Switch, Popconfirm} from 'antd';
import { PlusOutlined,NotificationOutlined, TeamOutlined, HomeOutlined, CloseOutlined, LogoutOutlined, SearchOutlined, UploadOutlined, UserAddOutlined, LinkOutlined, InstagramOutlined, MailOutlined} from '@ant-design/icons';import { UserDeleteOutlined} from '@ant-design/icons';
import AuthContext from '../auth/AuthContext'
import {motion} from 'framer-motion'
import axios from 'axios'
import ClubContext from '../util/ClubContext';
import UserClubContext from '../util/UserClubContext'
import moment from 'moment'

const {SubMenu} = Menu

const {Title , Text, Paragraph} = Typography
const { Option, OptGroup } = Select;








const ClubSettings = ({history}) => {

    const clubURL = useParams().club
    

    const [modal, setModal] = useState({open: false})

    const {auth, setAuth} = useContext(AuthContext)
    const {clubContext, setClubContext} = useContext(ClubContext)
    const [activeKey, setActiveKey] = useState("info")
 
    const [club,setClub] = useState(null)
    const [clubMembers, setClubMembers] = useState(null)
    const [announcements, setAnnouncements] = useState(null)
    const [search, setSearch] = useState()

    const [menu,setMenu] = useState("info")




    const [form, setForm] = useState()
    const [errors,setErrors] = useState([])
    const [edited,setEdited] = useState(false)

    const {userClubContext, setUserClubContext} = useContext(UserClubContext)



    const makeAnnouncement = async () => {
        try{
            const clubRes = await axios.post(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/announcement/`, {message: modal.message})
            
            if(clubRes.data){
                setModal({open: false})
                message.success("Message Sent", 5)
                setAnnouncements([{message: modal.message, date: Date.now(), senderName: auth.user.name} ,...announcements])
            }
        } catch(err) {
            console.log(err)
        }
    }


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

       

    }, [auth, club, search, clubMembers])


    const handleForm = e => {
        setEdited(true)
        setForm({...form, [e.target.id]: e.target.value})
     }

     const handleContactForm = e => {
        setEdited(true)

        const temp = form.contact
        temp[e.target.id] = e.target.value 
        setForm({...form, contact: temp})
     }

    






    const props = {
        name: 'file',
        action: `${process.env.REACT_APP_AUTH_API}/static`,
        headers:{
          authorization: 'test'
        },
        onChange(info) {
          if (info.file.status === 'done') {
              setEdited(true)
              setForm({...form, logo: info.file.response})
          } 
        },
        showUploadList: false
      }

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
    



    const kickMember = async (idToKick) => {
        console.log(idToKick)
        try{
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/${idToKick}/`)
            const club = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : club})
            setClubMembers({...clubMembers, members: clubMembers.members.filter((user) => user._id != idToKick), officers: clubMembers.officers.filter((user) => user._id != idToKick)})
            message.success('Club member kicked', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }

    const acceptMember = async (idToAdd) => {
        console.log("h")
        try{
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/${idToAdd}/accept`)
            
            const club = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : club})
            const userToAdd = clubMembers.applicants.find((user) => user._id ==  idToAdd)

            setClubMembers({...clubMembers, applicants: clubMembers.applicants.filter((user) => user._id != idToAdd), members: [userToAdd].concat(clubMembers.members)})
            message.success('Club member accepted', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }

    const promoteMember = async (idToPromote) => {
        console.log(idToPromote)
        console.log("h")
        try{
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/${idToPromote}/promote`)
            
            const club = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : club})
            const userToPromote = clubMembers.members.find((user) => user._id ==  idToPromote)

            setClubMembers({...clubMembers, members: clubMembers.members.filter((user) => user._id != idToPromote), officers: [userToPromote].concat(clubMembers.officers)})
            message.success('Club member promoted', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }
 
    const demoteMember = async (idToDemote) => {

        console.log(idToDemote)
        try{
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${clubURL}/members/${idToDemote}/demote`)
            
            const club = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : club})
            const userToDemote = clubMembers.officers.find((user) => user._id ==  idToDemote)

            setClubMembers({...clubMembers, officers: clubMembers.officers.filter((user) => user._id != idToDemote), members: [userToDemote].concat(clubMembers.members)})
            message.success('Club member demoted', 5)

        } catch(err){

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
                    <Card hoverable style={{borderRadius: "20px", padding: "0px"}}>
                                <Menu
                                    mode="inline"
                                    style={{ borderRadius: "20px", border: "0px" }}
                                    selectable={false}
                                    onClick={(e) =>{
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
                                </Menu>
                    </Card>
                  
                    </div>



                    <div style={{width: "75%", marginLeft:"2.5%"}}>
                        <Card  style={{ borderRadius: "20px", marginBottom: "20px"}}>
                    {auth.user && form && 
                    <>


                        {menu == 'announcements' && announcements &&
                        <div style={{width:"100%", display:"flex"}}>
                             <List
                            style={{width: '100%'}}
                            header={
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}> 
                                    <Text> Announcements </Text>
                                    <Tooltip title="New announcement"><PlusOutlined onClick={() => setModal({open: true})} style={{cursor: 'pointer'}}/></Tooltip>
                                </div>
                            }
                            itemLayout="horizontal"
                            dataSource={announcements.reverse()}
                            renderItem={announcement => {
                                console.log(announcement)
                                return(

                                    <List.Item
                                     actions={
                                        [moment(announcement.date).calendar()]
                                     }
                                    >
                                        <List.Item.Meta
                                        title={announcement.senderName}
                                        description={<Text> {announcement.message} </Text>}
                                        />

                                    </List.Item>
                                )
                            }}
                            />
                        </div>
                        }



                        {menu == 'info' &&
                        <> 
                        <div style={{width:"100%", display:"flex"}}>
                                <Upload {...props}>
                                    <Badge offset={[-20, 10]} style={{background:"White"}} count={
                                        <Button style={{background:"White"}} shape="circle">
                                            <UploadOutlined></UploadOutlined>
                                        </Button>
                                            // <UploadOutlined style={{padding: "7px", borderRadius: "100px", boxShadow: "1px 1px 10px rgba(0,0,0,0.15)"}}></UploadOutlined>
                                    }>
                                        <Avatar size={100} style={{border: "0.5px solid #eee"}} src={form.logo ? form.logo : club.logo}></Avatar>
                                    </Badge>
                                </Upload>
                            <div style={{display: "flex",paddingLeft: "20px", justifyContent: "space-evenly", width: "calc(100% - 100px)", flexDirection:"row"}}>
                                    <div style={{width: "45%"}}>
                                        <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>CLUB NAME</Text>
                                            </div>
                                            <Input id="name" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Name" value={form.name}></Input>

                                        </div>
                                        <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>TAGLINE</Text>
                                            </div>
                                            <Input rows={2} id="tagline" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="A short line describing your club" value={form.tagline}></Input>


                                        </div>
                                        <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>DESCRIPTION</Text>
                                            </div>
                                            <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} id="description" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="What does your club do, or aim to achieve?" value={form.description}></Input.TextArea>


                                        </div>
                                        <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>GET INVOLVED</Text>
                                            </div>
                                            <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} id="getInvolved" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="How should students get involved?" value={form.getInvolved}></Input.TextArea>


                                        </div>
                                    

                                    </div>
                                    <div style={{width: "45%"}}>
                                    <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>ZOOM LINk </Text>
                                            </div>
                                            <Input id="zoom" prefix={<LinkOutlined style={{marginRight: "5px"}} />} onChange={handleContactForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Club zoom link" value={form.contact.zoom}></Input>
                                    </div>
                                    <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>WEBSITE </Text>
                                            </div>
                                            <Input id="website" prefix={<LinkOutlined style={{marginRight: "5px"}} />} onChange={handleContactForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Link" value={form.contact.website}></Input>
                                    </div>
                                    <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>EMAIL </Text>
                                            </div>
                                            <Input id="email" prefix={<MailOutlined style={{marginRight: "5px"}} />} onChange={handleContactForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Email" value={form.contact.email}></Input>
                                    </div>
                                    <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>INSTAGRAM </Text>
                                            </div>
                                            <Input id="instagram" prefix={<InstagramOutlined style={{marginRight: "5px"}} />} onChange={handleContactForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Username" value={form.contact.instagram}></Input>
                                    </div>

                                    <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>TAGS </Text>
                                            </div>
                                            <Select
                                                size={"default"}
                                                mode="multiple"
                                                style={{ width: '100%', margin: "0px 0px", border: "none",  borderRadius: "5px"}}
                                                placeholder="Search club tags"
                                                value={form.tags}
                                                className="settings"
                                                onSelect={(e) => {
                                                    setEdited(true)
                                                    console.log(form.tags.length)
                                                    if(form.tags.length >= 3){
                                                        setErrors([{"msg": "You can only have 3 tags"}])
                                                    } else {
                                                        setForm({...form , tags: [...form.tags, e]})
                                                    }
                                                }}
                                                onDeselect={(e) => {
                                                    setEdited(true)

                                                    setForm({...form , tags: form.tags.filter( (tag) => e != tag)})
                                                }}
                                        
                                            >
                                                <Option key="Academics"> Academics </Option>
                                                <Option key="Art"> Art </Option>
                                                <Option key="Athletics"> Athletics </Option>
                                                <Option key="Business"> Business </Option>
                                                <Option key="Competition"> Competition </Option>
                                                <Option key="Cultural"> Cultural </Option>
                                                <Option key="Cooking"> Cooking </Option>
                                                <Option key="Diversity"> Diversity </Option>

                                                <Option key="Gaming"> Gaming </Option>
                                                <Option key="Mentorship"> Mentorship </Option>
                                                <Option key="Politics"> Politics </Option>
                                                <Option key="Programming"> Programming </Option>
                                                <Option key="Religion">Religion</Option>
                                                <Option key="Science">Science</Option>
                                                <Option key="Theater"> Theater </Option>
                                                <Option key="Technology"> Technology </Option>
                                                <Option key="Volunteering"> Volunteering </Option>


                                            </Select>
                                    </div>
                                    <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>CLUB COLOR</Text>
                                            </div>
                                            <Input type="color" id="color" onChange={handleForm} style={{width: "125px", height: "125px", borderRadius: "5px", cursor: "pointer", padding: "0px", border: "none"}}  value={form.color}></Input>


                                        </div>

                                
                                    </div>


                            </div>
                            
                                
                            
                        </div>
                        <div style={{width:"100%", display:"flex", marginTop: "80px"}}>
                            <div style={{paddingLeft: "20px", marginLeft:"100px", width: "calc(100% - 100px)", display:"flex", justifyContent:"center"}}>
                                <div style={{width: "95%", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                    { errors.length > 0 &&
                                        <Text type="danger">{errors[0].msg}</Text>
                                    }
                                    {edited &&
                                        <Button style={{marginLeft: "15px"}} onClick={updateClub} type='primary'>Save</Button>
                                    }                                
                                </div>
                            </div>
                        </div>
                        </>
                        }
                        {menu == 'app' &&
          <div style={{display: "flex", justifyContent: "center"}}>
                            { clubMembers?.officers &&
                            <div style={{width: "95%"}}>
                            <div style={{marginBottom: "20px"}}>
                                <div>
                                    <Divider orientation="left" plain>
                                        Application Settings
                                    </Divider>
                                    <div style={{display:"flex", justifyContent: "space-between"}}>
                                    <div style={{width: "85%"}}>
                                            <Text>Allow students to join without being manually accepted </Text>
                                    </div>
                                    <Switch checked={form.settings.autoJoin} onChange={() => {
                                        setEdited(true)
                                        setForm({...form, settings: {...form.settings, autoJoin: !form.settings.autoJoin} })}}
                                    />
                                </div>
                            </div>
                        </div>
                            <List
                            header="Applicants"
                            itemLayout="horizontal"
                            dataSource={clubMembers.applicants}
                            renderItem={member => {
                                return(

                                    <List.Item
                                    actions={[<div style={{display:'flex', alignItems:'center'}}>
                                                <Tooltip title="Accept"> <UserAddOutlined onClick={() => acceptMember(member._id)}style={{fontSize: "18px", color: "#52c41a", cursor: "pointer"}}/>  </Tooltip>
                                            </div>]}
                                    >
                                        <List.Item.Meta
                                        avatar={<Avatar size ={45} src={member.profilePictureURL}/>}
                                        title={member.name}
                                        description={<Text editable> {club.titles[member._id] || "Applicant"} </Text>}
                                        />

                                    </List.Item>
                                )
                            }}
                        />

                            <div style={{width:"100%", display:"flex", marginTop: "80px"}}>
                            <div style={{paddingLeft: "20px", marginLeft:"100px", width: "calc(100% - 100px)", display:"flex", justifyContent:"center"}}>
                                <div style={{width: "95%", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                    { errors.length > 0 &&
                                        <Text type="danger">{errors[0].msg}</Text>
                                    }
                                    {edited &&
                                        <Button style={{marginLeft: "15px"}} onClick={updateClub} type='primary'>Save</Button>
                                    }                                
                                </div>
                            </div>
                        </div>
                            </div>
                            }
                        </div>
                        
                        }
                        {menu == 'members' &&
                        <>
                        <div style={{display: "flex", justifyContent: "center"}}>

                            { clubMembers?.officers &&
                            <div style={{width: "95%"}}>
                            <List
                            header={
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}> 
                                    <Text> Sponsors </Text>
                                    <Input suffix={<SearchOutlined></SearchOutlined>} placeholder="Search club members" bordered={false} style={{width: '25%'}} onChange={e => setSearch(e.target.value)}></Input>
                                </div>
                            }
                            itemLayout="horizontal"
                            dataSource={ search ? clubMembers.sponsors.filter((user) => user.name.indexOf(search.toLower()) != -1) : clubMembers.sponsors}
                            renderItem={member => {
                                return(

                                    <List.Item>
                                        <List.Item.Meta
                                        avatar={<Avatar size ={45} src={member.profilePictureURL}/>}
                                        title={member.name}
                                        description={<Text editable={{ onChange: (str) => {
                                            setEdited(true)
                                            console.log(str)
                                            let titles = form.titles
                                            titles[member._id] = str
                                            setForm({...form, titles: titles})

                                        }}}>{form.titles[member._id] || "Sponsor"}</Text>}
                                        />

                                    </List.Item>
                                )
                            }}
                        />
                            <List
                                header="Officers"
                                itemLayout="horizontal"
                                dataSource={ search ? clubMembers.officers.filter((user) => user.name.indexOf(search.toLower()) != -1) : clubMembers.officers}
                                renderItem={member => {
                                    return(

                                        <List.Item
                                            actions={club.sponsors.includes(auth.user._id) && [<div style={{display:'flex', alignItems:'center'}}>
                                          <Tooltip title="Demote"> <UserDeleteOutlined onClick={() => demoteMember(member._id)} style={{fontSize: "18px", color: "#ff4d4f", cursor: "pointer"}}/>  </Tooltip>
                                            </div>]}
                                        >
                                            <List.Item.Meta
                                            avatar={<Avatar size ={45} src={member.profilePictureURL}/>}
                                            title={member.name}

                                            description={<Text editable={{ onChange: (str) => {
                                                setEdited(true)
                                                console.log(str)
                                                let titles = form.titles
                                                titles[member._id] = str
                                                setForm({...form, titles: titles})

                                            }}}>{form.titles[member._id] || "Officer"}</Text>}
                                            
                                            />

                                        </List.Item>
                                    )
                                }}
                            />
                            <List
                                header="Members"
                                itemLayout="horizontal"
                                dataSource={search ? clubMembers.members.filter((user) => user.name.indexOf(search.toLower()) != -1) : clubMembers.members}
                                renderItem={member => {
                                    return(

                                        <List.Item
                                        actions={[
                                        <div style={{display:'flex', alignItems:'center'}}>
                                            <Tooltip title="Promote"> <UserAddOutlined onClick={() => promoteMember(member._id)} style={{fontSize: "18px", color: "#52c41a", cursor: "pointer", marginRight: "5px"}}/>  </Tooltip>
                                            <Tooltip title="Kick"> <CloseOutlined onClick={() => kickMember(member._id)} style={{fontSize: "18px", color: "#ff4d4f", cursor: "pointer"}}/>  </Tooltip>
                                        </div>]}
                                        >
                                            <List.Item.Meta
                                            avatar={<Avatar size ={45} src={member.profilePictureURL}/>}
                                            title={member.name}
                                            description={<Text editable={{ onChange: (str) => {
                                                setEdited(true)
                                                let titles = form.titles
                                                titles[member._id] = str
                                                setForm({...form, titles: titles})

                                            }}}>{form.titles[member._id] || "Member"}</Text>}
                                            
                                            
                                            />

                                        </List.Item>
                                    )
                                }}
                            />
                            <div style={{width:"100%", display:"flex", marginTop: "80px"}}>
                            <div style={{paddingLeft: "20px", marginLeft:"100px", width: "calc(100% - 100px)", display:"flex", justifyContent:"center"}}>
                                <div style={{width: "95%", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                    { errors.length > 0 &&
                                        <Text type="danger">{errors[0].msg}</Text>
                                    }
                                    {edited &&
                                        <Button style={{marginLeft: "15px"}} onClick={updateClub} type='primary'>Save</Button>
                                    }                                
                                </div>
                            </div>
                        </div>
                            </div>
                            }
                        </div>
                        </>
                        }
                        
                    </>
                    }
                    </Card>
                 
                    </div>
                    </div>
            


                
            </>}
            </Col>
        </Row>
        {club &&
        <Modal
          title={ 
           <div style={{display:"flex", alignItems:'center'}}>
            <Avatar src={club?.logo} size={35}  style={{marginRight: "15px", borderRadius: "10px"}}></Avatar>
            <Text>Post Announcement</Text>
           </div> 
          }
          visible={modal.open}
          onOk={makeAnnouncement}
          okText={"Send"}
          style={{}}
          onCancel={() => setModal({open: false})}
        >  
            <div style={{textAlign: 'center'}}>
            <Input.TextArea onChange={(e) => setModal({...modal, message: e.target.value})} placeholder='Your message' value={modal.message}>
          </Input.TextArea>
          <Text strong>{club.members.length + club.officers.length - club.settings.smsDisabled} will recieve an SMS notification</Text>

            </div>

        </Modal>
        }
        </>
    )
}

export default ClubSettings;