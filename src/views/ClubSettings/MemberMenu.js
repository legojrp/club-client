import React, {useState, useContext} from 'react'

import {Button, Typography, Avatar, Tooltip, List, Input,message} from 'antd'
import { CloseOutlined, UserAddOutlined, UserDeleteOutlined, SearchOutlined} from '@ant-design/icons';

import axios from 'axios'

import ClubContext from '../../util/ClubContext'
import AuthContext from '../../contexts/AuthContext'


const {Text} = Typography

const MemberMenu = ({form, errors, edited, setEdited, clubMembers, setForm, club, updateClub, setErrors, setClub, setClubMembers}) => {


    const [search, setSearch] = useState("")

    const {clubContext, setClubContext} = useContext(ClubContext)
    const {auth, setAuthContext} = useContext(AuthContext)


    const kickMember = async (idToKick) => {
        console.log(idToKick)
        try{
            const clubRes = await axios.delete(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/members/${idToKick}/`)
            const clubData = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : clubData})
            setClubMembers({...clubMembers, members: clubMembers.members.filter((user) => user._id != idToKick), officers: clubMembers.officers.filter((user) => user._id != idToKick)})
            message.success('Club member kicked', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }

  

    const promoteMember = async (idToPromote) => {

        console.log("bruh")
        try{
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/members/${idToPromote}/promote`)
            
            const clubData = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : clubData})
            const userToPromote = clubMembers.members.find((user) => user._id ==  idToPromote)

            setClubMembers({...clubMembers, members: clubMembers.members.filter((user) => user._id != idToPromote), officers: [userToPromote].concat(clubMembers.officers)})
            message.success('Club member promoted', 5)

        } catch(err){
            console.log(err)
            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }
 
    const demoteMember = async (idToDemote) => {

        console.log(idToDemote)
        try{
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/members/${idToDemote}/demote`)
            
            const clubData = clubRes.data
            
            setClub(clubRes.data)
            setClubContext({...clubContext, [club.url] : clubData})
            const userToDemote = clubMembers.officers.find((user) => user._id ==  idToDemote)

            setClubMembers({...clubMembers, officers: clubMembers.officers.filter((user) => user._id != idToDemote), members: [userToDemote].concat(clubMembers.members)})
            message.success('Club member demoted', 5)

        } catch(err){

            console.log(err.msg)
            setErrors([{"msg": "Server error"}])
        }
    }

    return(
        <>
        {clubMembers && 
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
                            dataSource={ search ? clubMembers.sponsors.filter((user) => user.name.toLowerCase().indexOf(search.toLowerCase()) != -1) : clubMembers.sponsors}
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
                                dataSource={ search ? clubMembers.officers.filter((user) =>user.name.toLowerCase().indexOf(search.toLowerCase()) != -1) : clubMembers.officers}
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
                                dataSource={search ? clubMembers.members.filter((user) => user.name.toLowerCase().indexOf(search.toLowerCase()) != -1) : clubMembers.members}
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
        }
        </>
    )
}


export default MemberMenu