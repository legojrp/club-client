import React from 'react'

import moment from 'moment'

import {Modal, Avatar, Typography, List} from 'antd'


const {Text} = Typography

const AnnouncementModal = ({ setAModal,aModal, clubAnnouncements}) => {

    return(
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
        onCancel={() => setAModal({...aModal, open: false})}
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
    )
}

export default AnnouncementModal