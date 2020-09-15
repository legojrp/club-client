import React from 'react'
import {Link} from 'react-router-dom'

import {Card} from 'antd'
import { LinkOutlined, InstagramOutlined, MailOutlined } from '@ant-design/icons';


const ContactCard = ({club}) => {
    
    return(
        <Card hoverable title="Contact" style={{ borderRadius: "20px", marginBottom: "20px"}}>
            { club?.contact?.website &&
            <p><LinkOutlined style={{marginRight: "10px"}} /> <a target="_blank" href={`https://${club.contact.website.replace(/http([a-z]?):\/\//, "")}`}> {club.contact.website.replace(/http([a-z]?):\/\//, "")} </a> </p>
            }
            {club.contact?.instagram &&
            <p><InstagramOutlined style={{marginRight: "10px"}} /> <a target="_blank" href={`https://instagram.com/${club.contact.instagram}`}> @{club.contact.instagram} </a></p>

            }
            {club.contact?.email &&
            <p><MailOutlined style={{marginRight: "10px"}} /> <Link>{club.contact.email}</Link></p>
            }
        </Card>
    )
}

export default ContactCard