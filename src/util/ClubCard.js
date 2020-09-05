import React from 'react';
import {Link} from 'react-router-dom'

import { UserOutlined, CalendarFilled, CalendarOutlined, CalendarTwoTone, setTwoToneColor} from '@ant-design/icons';
import { Row, Col, Typography, Button, Avatar, Menu, Card, Select, Tag, Tooltip} from 'antd';

import logo from '../img/icon.jpeg'


const {Title , Text, Paragraph} = Typography



const Navbar = ({clubData}) => {
  const { name, color, description, sponsors, logo, url, members, officers, tags, tagline} = clubData
  return (
    <Link to={"/clubs/" + url}>
        <Card style={{ width: "31.5rem", borderRadius: "1.5rem", height:"16.5rem", margin: "0px 2rem 2rem 0px",}} hoverable loading={false}>
            <Row>
                    <Col span={17}>
                        <Title level={4}>{name}</Title>
                        <div>
                            {tags.map( tag => <Tag style={{marginBottom:"8px"}}color={color}>{tag}</Tag> )}
                        </div>
                    </Col>
                    <Col span={6} offset={1} align="right">
                        <Avatar src={logo} style={{borderRadius:"15px"}} size={70}></Avatar>
                    </Col>
                </Row>
                <Paragraph style={{marginTop: "13px", fontSize: "16px", height:"50px"}}>
                    {tagline}
                </Paragraph>
                <Row style={{position: 'relative', bottom: "0px"}}>
                    <Col span={6} style={{display: "flex", alignItems:"flex-end"}}>
                        <Text><UserOutlined></UserOutlined> {members.length + officers.length + sponsors.length } </Text>
                    </Col>
                    <Col span={12} offset={6} align="right">
                        <Text style={{letterSpacing:"0.24rem", fontSize: "10px"}}> M T W T F </Text>
                        <br/>
                        <Text> Before </Text> <Text style={{marginLeft: "5px"}}> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> </Text>

                        <br/>
                        <Text> After </Text> <Text style={{marginLeft: "5px"}}> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <Tooltip title="Meeting"> <CalendarFilled style={{color: color}}/>  </Tooltip> </Text>
                    </Col>
                </Row>
        </Card>
    </Link>
  );
}

export default Navbar;
