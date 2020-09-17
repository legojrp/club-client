import React, { useState, useContext } from 'react'

import {Divider, List, Tooltip, Avatar, Button, Typography, Switch, message} from 'antd'
import { UserAddOutlined} from '@ant-design/icons';


import ClubContext from '../../util/ClubContext';


import axios from 'axios'

const {Text} = Typography


const ApplicationMenu = ({updateClub, form, club, setForm, clubMembers, errors, setErrors, edited, setEdited, setClub, setClubMembers}) => {

    const {clubContext, setClubContext} = useContext(ClubContext)


    const acceptMember = async (idToAdd) => {
        try{
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/members/${idToAdd}/accept`)
            
            const clubData = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : clubData})
            const userToAdd = clubMembers.applicants.find((user) => user._id ==  idToAdd)

            setClubMembers({...clubMembers, applicants: clubMembers.applicants.filter((user) => user._id != idToAdd), members: [userToAdd].concat(clubMembers.members)})
            message.success('Club member accepted', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }


    return(
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
    
    )
}

export default ApplicationMenu