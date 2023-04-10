import React , {useEffect, useContext} from 'react';
import Navbar from '../../util/Navbar'
import {Link} from 'react-router-dom'
import { Modal, Menu, Typography, Badge, Card, Select, Tag, List, Avatar, Tooltip, Dropdown, Switch, Input, message, Button} from 'antd';

import ClubCard from '../../util/ClubCard'
import LoadingCard from '../../util/LoadingCard'
import { UserOutlined, TagOutlined, InstagramOutlined, NotificationOutlined, SearchOutlined, SettingOutlined, MoreOutlined, UserDeleteOutlined, BellOutlined, GithubOutlined} from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios'
import AuthContext from '../../contexts/AuthContext'
import ClubContext from '../../util/ClubContext';
import UserClubContext from '../../contexts/UserClubContext';
import moment from 'moment'



import TagSelector from '../SharedComponents/TagSelector'
import FilterClubsCard from './FilterClubsCard';
import MyClubsCard from './MyClubsCard'

const {Title , Text, Paragraph} = Typography
const { Option, OptGroup } = Select;










const ClubBrowse = ({history}) => {

    const [clubs,setClubs] = useState(null)
    const [filteredClubs, setFilteredClubs] = useState(null)
    const {auth, setAuth} = useContext(AuthContext)
    const {clubContext, setClubContext} = useContext(ClubContext)



    const[betaModal, setBetaModal] = useState()

    const getClubs = async () => {
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


    useEffect(()=>{

        if(localStorage.getItem('beta-modal')){
            setBetaModal(false)
        } else {
            setBetaModal(true)
            setTimeout(() => {
                localStorage.setItem('beta-modal', 'wow')
            }, 5000)

        }

        if(!clubs){
            getClubs()
        }

    }, [clubs, auth])


console.log(auth.user)

    return(
        <>
        <Navbar></Navbar>
        <div style={{background: "#fafcff", display:"flex",flexDirection:"row",height:"calc(100vh - 60px)", width: "100%"}}>
            <div style={{height: 60, width:"35%", maxWidth: "400px"}} >

                {auth.user &&
                    <MyClubsCard/>
                }       

                <FilterClubsCard clubs={clubs} setFilteredClubs={setFilteredClubs}/>
                
                <div style={{width: '100%', textAlign:'center', paddingLeft: '40px'}}>
                    <Text style={{fontSize: '12px'}}>Made by a HSE</Text>
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
        </>
    )
}

export default ClubBrowse;