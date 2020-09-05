import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom'

import { Row, Col, Typography, Button, Dropdown, Drawer,Menu, Avatar} from 'antd';

import { UserOutlined, SearchOutlined, LogoutOutlined, MenuOutlined, SettingOutlined, LinkOutlined} from '@ant-design/icons';


import logo from '../img/hseapps.png'
import AuthContext from '../auth/AuthContext'

import {motion} from 'framer-motion'
const {SubMenu} = Menu

const {Title , Text, Paragraph} = Typography












const menu = (
    <Menu style={{textAlign: "center"}}>
      <Menu.Item>
        <Link to="/team"> Team </Link>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          FAQ
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          Contact
        </a>
      </Menu.Item>
    </Menu>
);











const Navbar = ({history}) => {

  const {auth, setAuth} = useContext(AuthContext)

  return (
    <> 
      <div style={{borderBottom: 'solid 1px rgba(0,0,0,0.1)'}}>
        <Row style = {{padding: '10px'}} align = "middle">
        <Col span={8} style={{display: "flex", alignItems: "center"}}>
            <Link to="/"><motion.img whileHover={{ scale: 1.05 }} src={logo} style={{height: "40px"}}></motion.img></Link>
            <Title level={3} style={{margin: "0px 5px"}}> HSE Clubs</Title>
        </Col>
        <Col span={8} offset={8} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          {auth.isAuth ? 
            <>
              <Text style={{marginRight: "10px", fontSize: "16px"}}>{auth.user.name}</Text>
                <motion.div style={{marginRight: "10px"}} whileHover={{ scale: 1.03 }}>
                  <Link to="/settings">
                    {auth.user.profilePictureURL == "default" ?
                      <Avatar style={{cursor: "pointer"}} icon={<UserOutlined />} size={35} />
                    :
                      <Avatar style={{cursor: "pointer"}}src={auth.user.profilePictureURL} size={35} />
                    }

                  </Link>
                </motion.div>

            </>
          
          
          :
            <>

              <Link to="/login">
                <Button type="primary" icon={<UserOutlined />} size={'mediun'}>
                    Login
                </Button>
              </Link>
            </>
          }
        </Col>
        </Row>
  
      </div>
    </>
  );
}

export default Navbar;
