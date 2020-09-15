import React from 'react'

import {Modal, Avatar, Typography, Input} from 'antd'

import axios from 'axios'

const {Text} = Typography

const MakeAnnouncementModal = ({modal, setModal}) => {

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
                <Text>{modal.club?.officers.length + modal.club?.members.length - modal.club?.settings.smsDisabled.length} will recieve an SMS notification if they have linked their phone number</Text>
            </div>

      </Modal>
    )
}

export default MakeAnnouncementModal