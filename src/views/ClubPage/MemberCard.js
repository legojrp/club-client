import React from 'react';

import {Card, Avatar, Typography} from 'antd'

const {Text, Title} = Typography

const MemberCard = ({member, club, defaultTitle}) => {


    return(
        <Card hoverable style={{borderRadius: "20px", marginRight: "20px",marginBottom:'10px', width: "20%"}}>
            <div style={{display: "flex", alignItems:"center",width: "100%", flexDirection: "column"}}>
                    <Avatar size={60} style={{marginBottom: "15px"}} src={member.profilePictureURL}></Avatar>
                    <Title style={{fontSize: "1.1em", textAlign: "center", textTransform: "capitalize"}} level={4}> {member.name} </Title>
                    <Text style={{textAlign:'center'}}> {club.titles[member._id] ? club.titles[member._id] : defaultTitle} </Text>
            </div>
        </Card>
    )
}

export default MemberCard