import React from 'react'

import {Card} from 'antd'
import { VideoCameraOutlined } from '@ant-design/icons';


const GetInvolvedCard = ({club}) => {
    
    return(
        <Card hoverable title="Get Involved" style={{ borderRadius: "20px", marginBottom: "20px"}}>
            <p>{club.getInvolved}</p>
            {club.contact?.zoom &&
            <p><VideoCameraOutlined style={{marginRight: "10px"}} /> <a target="_blank" href={club.contact.zoom}>Club Zoom Link</a></p>
            }
        </Card>
    )
}

export default GetInvolvedCard