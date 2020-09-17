import React, { useState } from 'react'

import {Input, Button, Typography} from 'antd'
import { LinkOutlined, InstagramOutlined, MailOutlined} from '@ant-design/icons'

import AvatarUpload from '../SharedComponents/AvatarUpload'
import TagSelector from '../SharedComponents/TagSelctor'


const {Text} = Typography

const InformationMenu = ({form, updateClub, setForm, edited, setEdited, errors,setErrors}) => {


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


    return(

        <> 
        <div style={{width:"100%", display:"flex"}}>
                                     
        <AvatarUpload  
            avatar={form.logo}
            changeHandeler={(info) => {
                console.log(info.file)
                      if (info.file.status === 'done') {
                        setEdited(true)
                        setForm({...form, logo: info.file.response})
                        } 

        }}/>
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

                            <TagSelector 
                                className="settings"
                                placeholder="Adds tag to allow for easier searchability"
                                defaultValue={form.tags}
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
    )
}

export default InformationMenu