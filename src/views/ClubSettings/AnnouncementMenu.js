import React, {useEffect, useState} from 'react'

import {List, Tooltip, Typography, message, Avatar, Modal, Input} from 'antd'
import { PlusOutlined} from '@ant-design/icons'

import moment from 'moment'
import axios from 'axios'

const {Text} = Typography


const AnnouncementMenu = ({club, auth, announcements, setAnnouncements}) => {


    const [modal, setModal] = useState({open: false})

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

    return(
        <>
        {announcements &&
        <>
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
                    dataSource={announcements}
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
            </>
            }
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
        </>
    )
}

export default AnnouncementMenu
