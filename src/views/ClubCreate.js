import React , {useState, useContext, useEffect} from 'react';
import Navbar from '../util/Navbar'
import {useParams} from 'react-router-dom'
import { Row, Col, Typography, PageHeader, Card, Select, Upload, Avatar, Menu, Badge, Button, Input, Divider, message, List, Tooltip, Switch, Popconfirm} from 'antd';
import { TeamOutlined, HomeOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined, VideoCameraOutlined, LinkOutlined, InstagramOutlined, MailOutlined} from '@ant-design/icons';import { UserDeleteOutlined} from '@ant-design/icons';
import AuthContext from '../contexts/AuthContext'
import ClubContext from '../util/ClubContext'
import {motion} from 'framer-motion'
import axios from 'axios'
import TagSelector from './SharedComponents/TagSelctor';
import AvatarUpload from './SharedComponents/AvatarUpload'
const {SubMenu} = Menu


const {Title , Text, Paragraph} = Typography
const { Option, OptGroup } = Select;




const ClubSettings = ({history}) => {

  
    const {auth, setAuth} = useContext(AuthContext)

 
    const [club,setClub] = useState(null)
    const [clubMembers, setClubMembers] = useState(null)

    const [menu,setMenu] = useState("info")


    const {clubContext, setClubContext} = useContext(ClubContext)


    const [form, setForm] = useState()
    const [errors,setErrors] = useState([])
    const [edited,setEdited] = useState(false)





    useEffect(() => {

        if(auth.user){
            setForm({
                name: "",
                class: "",
                img: "",
                description: "",
                getInvolved: "",
                tagline: "",
                color: "#000",
                contact:  {},
                tags: [],
                settings:  {},
                url: ""
            })  
        }


        

    }, [auth])


    const handleForm = e => {
        setEdited(true)

        if(e.target.id == 'name'){
            setForm({...form, url: e.target.value.replaceAll(" ", "-").toLowerCase(), name: e.target.value})
        } else if(e.target.id =='url'){
            setForm({...form, [e.target.id]: e.target.value.toLowerCase().replaceAll(" ", '-')})

        } else {
            setForm({...form, [e.target.id]: e.target.value})

        }
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

    
      const submitClub = async () => {
        try {

            const clubRes = await axios.post(`${process.env.REACT_APP_CLUB_API}/club/`, form)

            setClubContext({...clubContext, [clubRes.data.url] : clubRes.data})

            console.log(clubRes)
            if(clubRes.data){
                message.success('Club Created!', 5)
                history.push('/clubs/' +clubRes.data.url)
            }

        } catch (err) {
            console.log(err)
            console.log(err.msg)
            setErrors(err.response.data.errors)
        }
      }

    
    

   
    return(
        <>
        <Navbar></Navbar>
        <Row style={{background: "#fafcff", height:"100vh"}}>
            {auth.user && form &&

            <Col span={18} offset={3}>
                <PageHeader
                    style={{marginTop: "40px"}}
                    className="site-page-header"
                    onBack={() => history.push('/')}
                    title={
                        <div>
                            <Title level={2} style={{marginBottom:"0px"} } > Register Club</Title>
                        
                        
                        </div>
                    }
                    extra={[
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Text>{form.name}</Text>
                            <Divider type="vertical" />
                            <Text style={{margin: "0px"}}>{ "Sponsor" }</Text>
                            <Divider type="vertical" />
                            <Avatar size={35}  shape="square"  src={form.logo}></Avatar>
                        </div>
                    ]}
                />
                <div style={{width: "100%", display:"flex", justifyContent:'center'}}>
                    <Card style={{ borderRadius: "20px", margin: "20px 40px 0px 48px", width: "100%"}}>
                
                        <div style={{width: "100%", display: "flex", justifyContent:"space-evenly"}}>
                        
                        <AvatarUpload  
                            avatar={form.logo}
                            changeHandeler={(info) => {
                                      if (info.file.status === 'done') {
                                        setEdited(true)
                                        setForm({...form, logo: info.file.response})
                            } 
                        }}/>

                        
                        <div style={{display: "flex",paddingLeft: "10px", justifyContent: "space-evenly", width: "calc(100% - 110px)", flexDirection:"row"}}>                                    
                                    <div style={{width: "45%"}}>
                                        <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>CLUB NAME</Text>
                                            </div>
                                            <Input id="name" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Name" value={form.name}></Input>

                                        </div>
                                        <div style={{marginBottom: "15px"}}>
                                            <div style={{marginBottom:"3px"}}>
                                                <Text strong style={{fontSize: "10px"}}>CLUB ID</Text>
                                            </div>
                                            <Input id="url" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Club ID (Cannot be changed)" value={form.url}></Input>

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
                                                <Text strong style={{fontSize: "10px"}}>ZOOM LINK </Text>
                                            </div>
                                            <Input id="zoom" prefix={<VideoCameraOutlined style={{marginRight: "5px"}} />} onChange={handleContactForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Zoom meeting link" value={form.contact.zoom}></Input>
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
                                            <TagSelector
                                                className="settings"
                                                placeholder="Adds tag to allow for easier searchability"
                                                value={form.tags}
                                                handleSelect={(e) => {
                                                    setEdited(true)
                                                    console.log(form.tags.length)
                                                    if(form.tags.length >= 3){
                                                        setErrors([{"msg": "You can only have 3 tags"}])
                                                    } else {
                                                        setForm({...form , tags: [...form.tags, e]})
                                                    }
                                                }}
                                                handleDeselect={(e) => {
                                                    setEdited(true)

                                                    setForm({...form , tags: form.tags.filter( (tag) => e != tag)})
                                                }}
                                        
                                            />
                                           
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
                        <div style={{ width: "100%",display: "flex", justifyContent: "flex-end", paddingBottom: "50px"}}>
                            <div style={{width:'calc(100% - 110px)', display: "flex", justifyContent:"space-evenly"}}>
                                <div style={{width: "93%"}}>
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

                        </div>
                        <div style={{width:"100%", display:"flex", marginTop: "80px"}}>
                            <div style={{paddingLeft: "20px", marginLeft:"100px", width: "calc(100% - 100px)", display:"flex", justifyContent:"center"}}>
                                <div style={{width: "95%", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                    { errors.length > 0 &&
                                        <Text type="danger">{errors[0].msg}</Text>
                                    }
                                    {edited &&
                                        <Button style={{marginLeft: "15px"}} onClick={submitClub} type='primary'>Register</Button>
                                    }                                
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </Col>
            }
        </Row>
        </>
    )
}

export default ClubSettings;