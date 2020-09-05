import React from 'react';
import {Link} from 'react-router-dom'

import { UserOutlined, CalendarFilled, CalendarOutlined, CalendarTwoTone, setTwoToneColor} from '@ant-design/icons';
import { Row, Col, Typography, Button, Dropdown, Menu, Card, Select, Tag, Skeleton} from 'antd';

import logo from '../img/icon.jpeg'
import SkeletonAvatar from 'antd/lib/skeleton/Avatar';
import SkeletonButton from 'antd/lib/skeleton/Button';


const {Title , Text, Paragraph} = Typography



const LoadingCard = ()  => {
  return (
        <Card style={{ width: "500px", borderRadius: "20px", margin: "0px 20px 20px 0px"}} loading={false}>
            <Row style={{cursor: "pointer"}}>
                <Col span={17}>
                    <div style={{marginTop: "8px", width: "150px"}}> 
                        <Skeleton.Input size="small" active />
                    </div>
                </Col>
                <Col span={6} offset={1} align="right">
                    <div style={{height: "70px", paddingTop: "2px"}}>
                        <SkeletonAvatar shape="square" active size={65}></SkeletonAvatar>
                    </div>
                </Col>
            </Row>
            <div style={{marginTop: "20px"}}>
                <Skeleton paragraph={{rows: 4, width: ["100%", "100%", "100%", "70%"]}} title={false} active >  </Skeleton>
            </div>
            {/* <Row>
                <Col span={6} style={{display: "flex", alignItems:"flex-end"}}>
                    <div style={{display: "flex"}}>
                        <SkeletonButton size="small" active> </SkeletonButton>
                    </div>
                </Col>
                <Col span={12} offset={6} align="right" style={{visibility: "hidden"}}>
                    <Text style={{letterSpacing:"4px", fontSize: "10px"}}> M T W T F </Text>
                    <br/>
                    <Text> Before </Text> <Text style={{marginLeft: "5px"}}> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/>  </Text>

                    <br/>
                    <Text> After </Text> <Text style={{marginLeft: "5px"}}> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/> <CalendarOutlined/>  </Text>
                </Col>
            </Row> */}
        </Card>
  );
}

export default LoadingCard;
