import React from 'react'
import {Link, useHistory} from 'react-router-dom'

import {Row, Col, Typography} from 'antd'



import Navbar from './Navbar'



import {motion} from 'framer-motion'

import error404 from '../img/404.svg'


const {Text} = Typography

const Error404 = ({resource}) => {
    return(
        <Row style={{background: "#fafcff", height:"calc(100vh - 61px)"}}>
                
            <Col span={22} style={{}} offset={1}>
            <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <motion.img initial={{ scale: 0}} animate={{ scale: 1}} transition={{duration: 0.4, type: "spring"}} src={error404} style={{width: "80%", maxWidth: "450px", marginBottom: "50px"}}></motion.img>
                <Text type="secondary" style={{fontSize: "16px", textAlign:"center"}}> The {resource} you are looking for doesn't exist <br/><Link to="/">Go back to home</Link></Text>
            </div>
            </Col>
        </Row>
    )
}

export default Error404