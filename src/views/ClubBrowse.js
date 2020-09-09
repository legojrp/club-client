import React , {useEffect, useContext} from 'react';
import Navbar from '../util/Navbar'
import {Link} from 'react-router-dom'
import { Modal, Menu, Typography, Badge, Card, Select, Tag, List, Avatar, Tooltip, Dropdown, Switch, Input, message, Button} from 'antd';
import indiana from '../img/indiana.png'
import innovate from '../img/innovate.png'
import ClubCard from '../util/ClubCard'
import apps from '../img/hseapps.png'
import LoadingCard from '../util/LoadingCard'
import { UserOutlined, TagOutlined, InstagramOutlined, NotificationOutlined, SearchOutlined, SettingOutlined, MoreOutlined, UserDeleteOutlined, BellOutlined, GithubOutlined} from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios'
import AuthContext from '../auth/AuthContext'
import ClubContext from '../util/ClubContext';
import UserClubContext from '../util/UserClubContext';
import moment from 'moment'
const {Title , Text, Paragraph} = Typography
const { Option, OptGroup } = Select;





const menu = (
    <Menu>
      <Menu.Item>
           Text Notifications 
          <Switch  style ={{marginLeft: "15px"}}size="small"></Switch>
      </Menu.Item>
      <Menu.Item style={{display:"flex", alignItems:"center",justifyContent:"space-between"}} danger> 
        Leave Club
        <UserDeleteOutlined style={{ marginRight:"0px", fontSize:"13px"}}/>
      </Menu.Item>

    </Menu>
  );


function tagRender(props) {
    const { label, value, closable, onClose } = props;
    return (
      <Tag color={ value.substring(0,1) == "A" ? "red" : "blue"} closable={closable} onClose={onClose} style={{margin:"2px 2px"}}>
        {label}
      </Tag>
    );
  }



const ClubBrowse = ({history}) => {

    const [filter, setFilter] = useState({tags:[], sizes:[]})
    const [clubs,setClubs] = useState(null)
    const [filteredClubs, setFilteredClubs] = useState(null)
    const [userClubs, setUserClubs] = useState(null)

    const {auth, setAuth} = useContext(AuthContext)

    const {clubContext, setClubContext} = useContext(ClubContext)
    const {userClubContext, setUserClubContext} = useContext(UserClubContext)



    const [clubAnnouncements, setClubAnnouncements] = useState(null)

    const[modal, setModal] =  useState({open:false})
    const[aModal, setAModal] = useState({open : false})
    const[betaModal, setBetaModal] = useState()

    const getData = async () => {
        try {

            if(clubContext){

                const clubArr = []

                Object.keys(clubContext).forEach((key) => {
                    let club = clubContext[key]
                    if(club){
                        clubArr.push(club)
                    }
                })

                setClubs(clubArr)
                setFilteredClubs(clubArr)
            }

            const clubRes = await axios.get(`${process.env.REACT_APP_CLUB_API}/club/`)

            const clubObj = {}

            clubRes.data.forEach((club) => {
                clubObj[club.url] = club
            })

            setClubContext(clubObj)

            setClubs(clubRes.data)
            setFilteredClubs(clubRes.data)


        } catch (err) {
            if(err.response?.data?.errors){
                console.log(err.response.data.errors)
            } else {
                console.log(err)
            }

        }
    }

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


    const handleFilter = (e, options) => {
        if(options.type === "tag"){
            if(options.action === "add"){
                const newTags = filter.tags.concat([e])
                setFilter({...filter, tags: newTags})
            } else {
                const newTags = filter.tags.filter((tag) => tag != e)
                setFilter({...filter, tags: newTags})
            }
        } else if (options.type === "size"){
            if(options.action === "add"){
                const newSizes = filter.sizes.concat([e])
                setFilter({...filter, sizes: newSizes})
            } else {
                const newSizes = filter.sizes.filter((size) => size != e)
                setFilter({...filter, sizes: newSizes})
            }
        }
        filterClubs()
    }

    const sizeData = {
        small: 25,
        medium: 50,
        large: 100
    }
    const filterClubs = () => {
        const filteredClubs = clubs.filter((club) => {
            let tagFlag = false
            if(filter.tags.length == 0){
                tagFlag = true 
            } else {
                tagFlag = club.tags.some((tag) => filter.tags.includes(tag))
            }

            let sizeFlag = false 
            const clubTotalMembers = club.officers.length + club.members.length + club.sponsors.length
            let clubSize;
            if(clubTotalMembers > 100) {
                clubSize = 'Very Large'
            } else if (clubTotalMembers > 50){
                clubSize = 'Large'
            } else if (clubTotalMembers > 25){
                clubSize = 'Medium'
            } else {
                clubSize = 'Small'
            }
            if(filter.sizes.length == 0){
                sizeFlag = true 
            } else {
                sizeFlag = filter.sizes.some((size) => size == clubSize)
            }
            

            let searchFlag = false
            if(filter.search){
                if(club.name.toLowerCase().indexOf(filter.search.toLowerCase()) != -1){
                    searchFlag = true
                }
            } else {
                searchFlag = true
            }

            return tagFlag && (sizeFlag && searchFlag)
        })
        setFilteredClubs(filteredClubs)
    }


    useEffect(()=>{

        if(localStorage.getItem('beta-modal')){
            setBetaModal(false)
        } else {
            setBetaModal(true)
            setTimeout(() => {
                localStorage.setItem('beta-modal', 'wow')
            }, 5000)

        }



        if(auth.user && !userClubs){
            getUserClubs()
        }
        if(!clubs){
            getData()
        } else {
            filterClubs()
        }
    }, [filter, clubs, auth])


    const makeAnnouncement = async () => {
        try{
            const clubRes = await axios.post(`${process.env.REACT_APP_CLUB_API}/club/${modal.club.url}/announcement/`, {message: modal.message})

            if(clubRes.data){
                setModal({open: false})
            }
        } catch(err) {
            console.log(err)
        }
    }

    return(
        <>
        <Modal
          title={ 
           <div style={{display:"flex", alignItems:'center'}}>
            <Avatar src={modal.club?.logo} size={35}  style={{marginRight: "15px", borderRadius: "10px"}}></Avatar>
            <Text>Post Announcement</Text>
           </div> 
          }
          visible={modal.open}
          onOk={makeAnnouncement}
          okText={"Send"}
          style={{}}
          onCancel={() => setModal({...modal, open: false, message: ""})}
        >
            <div style={{textAlign: 'center'}}>
                <Input.TextArea onChange={(e) => setModal({...modal, message: e.target.value})} placeholder='Your message' value={modal.message}>
                </Input.TextArea>
                <Text>{modal.club?.officers.length + modal.club?.members.length - modal.club?.settings.smsDisabled.length} will recieve an SMS notification</Text>
            </div>

        </Modal>
        <Modal
          title={ 
           <div style={{display:"flex", alignItems:'center'}}>
            <Avatar src={aModal.club?.logo} size={35}  style={{marginRight: "15px", borderRadius: "10px"}}></Avatar>
            <Text>Club Announcements</Text>
           </div> 
          }
          visible={aModal.open}
          onOk={() => setAModal({open: false})}
          okText={"Send"}
          style={{}}
          onCancel={() => setAModal({...modal, open: false})}
          footer={null}
        >
            <div style={{width: '100%'}}>
                {aModal.club &&
                <List
                    dataSource={clubAnnouncements[aModal.club.url].announcements.reverse()}
                    pagination={{
                        pageSize: 5
                    }}
                    style={{width: '100%'}}
                    title='Previous Announcements'
                    renderItem={(announcement) => {


                        return(

                            <List.Item
                             actions={[moment(announcement.date).calendar()]}
                            >
                                <List.Item.Meta
                                title={announcement.senderName}
                                description={<Text> {announcement.message} </Text>}
                                />

                            </List.Item>
                        )
                    }}
                
                />
                }
            </div>

        </Modal>
        <Navbar></Navbar>
        <div style={{background: "#fafcff", display:"flex",flexDirection:"row",height:"calc(100vh - 60px)", width: "100%"}}>
            <div style={{height: 60, width:"35%", maxWidth: "400px"}} >
                {((auth.user && userClubs )) &&
                <Card title="My Clubs" bordered={true} extra={ auth.user.role == "teacher" &&[<Link to='/create'>Register Club</Link>]} style={{ width: "100%", margin: "40px 20px ", borderRadius: "20px" }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={userClubs}
                        renderItem={(club) => {
                        let actions = []
                        if(club.officers.includes(auth.user._id) || club.sponsors.includes(auth.user._id)){
                            actions = [
                                <Link ><Tooltip title="Make Announcement"><Badge><NotificationOutlined onClick={() => setModal({open: true, club})} style={{color:"rgba(0, 0, 0, 0.45)"}}/></Badge></Tooltip></Link>,
                                <Link to={`/clubs/${club.url}/settings`}> <Badge dot={club.applicants.length >= 1} offset={[-2,1]}><Tooltip title="Settings"><SettingOutlined style={{color:"rgba(0, 0, 0, 0.45)"}}/></Tooltip> </Badge></Link>
                            ]
                        } else {
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
                <Card title="Filter Clubs" bordered={true} style={{ width: "100%", margin: "40px 20px 10px 20px ", borderRadius: "20px" }}>
                <Input style={{ margin: "10px 0px 20px 0px"}} suffix={<SearchOutlined style={{marginRight: "0px"}}></SearchOutlined>}  onChange={e => setFilter({...filter, search: e.target.value})} placeholder="Search clubs"></Input>

                <Text style={{margin: "0px"}}> <TagOutlined style={{marginRight: "5px", marginLeft: "2px"}} /> Tags </Text>
                <Select
                    mode="multiple"
                    style={{ width: '100%', margin: "10px 0px" ,  border: "none"}}
                    placeholder="Filter by tag"
                    defaultValue={[]}
                    onSelect={(e) => handleFilter(e, {action: "add", type: "tag"})}
                    onDeselect={(e) => handleFilter(e, {action: "remove", type: "tag"})}
                    
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



                    {/* <OptGroup label="Academics">
                        <Option key="Engineering"> Engineering </Option>
                        <Option key="Software"> Software </Option>
                        <Option key="Science"> Science </Option>
                        <Option key="CS"> CS </Option>
                    </OptGroup>
                    <OptGroup label="Community">
                        <Option key="Volunteering"> Volunteering </Option>
                        <Option key="School Spirit"> School Spirit </Option>
                    </OptGroup>
                    <OptGroup label="Non Academic">
                        <Option key="Gaming"> Gaming </Option>
                        <Option key="Theater"> Theater </Option>
                    </OptGroup> */}
                </Select>


                {/* <Text> <CalendarOutlined style={{marginRight: "5px", marginLeft: "2px"}}/> Meeting Times </Text>
                <Select
                    mode="multiple"
                    style={{ width: '100%', margin: "10px 0px" }}
                    placeholder="Filter by meeting times"
                    defaultValue={[]}
                    tagRender={tagRender}
                >
                    <OptGroup label="Before School">
                        <Option key="BMonday"> Monday </Option>
                        <Option key="BTuesday"> Tuesday </Option>
                        <Option key="BWednesday"> Wednesday </Option>   
                        <Option key="BThursday"> Thursday </Option> 
                        <Option key="BFriday"> Friday </Option>     
                    </OptGroup>
                    <OptGroup label="After School">
                        <Option key="AMonday"> Monday </Option>
                        <Option key="ATuesday"> Tuesday </Option>
                        <Option key="AWednesday"> Wednesday </Option>   
                        <Option key="AThursday"> Thursday </Option> 
                        <Option key="AFriday"> Friday </Option>     
                    </OptGroup>
                </Select> */}
                <br></br>
                <Text> <UserOutlined style={{marginRight: "5px", marginLeft: "2px"}} /> Club Size </Text>
                <Select
                    mode="multiple"
                    style={{ width: '100%', margin: "10px 0px" }}
                    placeholder="Filter by size"
                    defaultValue={[]}
                    onSelect={(e) => handleFilter(e, {action: "add", type: "size"})}
                    onDeselect={(e) => handleFilter(e, {action: "remove", type: "size"})}
                >
                    <Option key="Small"> Small (1-25) </Option>
                    <Option key="Medium"> Medium (26-50) </Option>
                    <Option key="Large"> Large (51-100) </Option>
                    <Option key="Very Large"> Very Large (100+) </Option>
                </Select>
                </Card>
                <div style={{width: '100%', textAlign:'center', paddingLeft: '40px'}}>
                    <Text style={{fontSize: '12px'}}>Made by HSE Apps</Text>
                    <br></br>
                    <Text style={{fontSize: '18px'}}>
                    <a target="_blank" href="https://instagram.com/hseapps"><InstagramOutlined style={{marginRight: '8px'}}></InstagramOutlined></a>
                    <a target="_blank" href="https://github.com/HSE-Apps"><GithubOutlined style={{marginRight: '5px'}}></GithubOutlined></a>
                    </Text>

                </div>
            </div>


            <div style={{marginLeft: "4%", marginTop:"40px", width: "100%"}}>

                    <div >
                        <Title level={2} style={{marginBottom:"0px"} } >Browse Clubs</Title>
                        <Text type="secondary" style={{fontSize: "18px"}}>Find your community at HSE</Text>
                    </div>
                    <div style={{ margin:"20px 0px", display: "flex", flexWrap: "wrap", width:"100%"}}>

                    {clubs && filteredClubs ? 
                    <>
                        {filteredClubs.map(club => {
                            return(<ClubCard
                                clubData={club}
                            />)

                        })}
                    </>
                    :
                    <>
                        <LoadingCard></LoadingCard>
                        <LoadingCard></LoadingCard>
                        <LoadingCard></LoadingCard>
                        <LoadingCard></LoadingCard>
                    </>

                    }
                </div>



                
              
            </div>
        </div>
{/* 
        <Modal title="Pre-Release Disclaimer" onCancel={() => setBetaModal(false)}  visible={betaModal} onOk={() => setBetaModal(false)}>
            <Text>HSE Clubs is currently in alpha, allowing users to act as teachers and students for testing purposes. Only teacher accounts can register and sponsor clubs; in the final release the only way to obtain a teacher account will be by signing up with and verifying an @hse.k12.in.us email. <br/> <br/> <Text strong> Content on this site is by no means sponsored or moderated by HSE Apps during this pre-release.</Text> <br/> <br/> If you would like to test as a student, please use an email with an @gmail.com domain, and if you would like to test as a teacher, signup with a @hsestudents.org domain. Thank you for participating in this pre-release.</Text>
        </Modal> */}
        </>
    )
}

export default ClubBrowse;