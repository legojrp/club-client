import React , {useContext} from 'react';
import {Link} from 'react-router-dom'

import {Typography, Avatar, PageHeader} from 'antd'



import AuthContext from "../../contexts/AuthContext"


const {Text, Title} = Typography

const Header = ({club, leaveClub, joinClub, history}) => {


    const {auth, setAuth} = useContext(AuthContext)

    
    const pageHeaderLogic = () => {
        if(!auth.user || !club){
            return[         
                <Text> <Link to={`/login?redirect=/clubs/${club.url}?autojoin=true`}>Join Club</Link></Text>,
                <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
            ]
        } else {
            const userIsMember = club.members.includes(auth.user._id)
            const userIsOfficer = club.officers.includes(auth.user._id)
            const userisSponser = club.sponsors.includes(auth.user._id)
            const userIsApplicant = club.applicants.includes(auth.user._id)
            if(userIsMember){
                return[         
                    <Link><Text type="danger" onClick={leaveClub}> Leave Club</Text></Link>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            } else if (userIsOfficer || userisSponser){
                return[         
                    <Text> <Link to={`/clubs/${club.url}/settings`}> Manage Club</Link></Text>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            } else if (userIsApplicant){
                return[         
                    <Text>Pending Application</Text>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            } else {
                return[         
                    <Text> <Link onClick={() => joinClub()}> Join Club</Link></Text>,
                    <Avatar size={50}  shape="round" src={club.logo} ></Avatar>
                ]
            }

        }
    }

    return (
        <PageHeader
                 className="site-page-header"
                 onBack={() => history.push('/')}
                 title={
                     <div>
                         <Title level={2} style={{marginBottom:"0px"} } > {club.name}</Title>
                      
                      
                     </div>
                 }
                 extra={pageHeaderLogic()}
                 >

        </PageHeader>
    )
}


export default Header