import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import {} from '@ant-design/icons';
import { Modal, Col, Typography, Button, Avatar, Menu, Card, Select, Tag, Tooltip} from 'antd';

import logo from '../img/icon.jpeg'

import AuthContext from '../auth/AuthContext'


const {Title , Text, Paragraph} = Typography



const Navbar = ({testToken}) => {

    const history = useHistory()

    console.log()

    const {auth, setAuth} = useContext(AuthContext)

    const [modal, setModal] = useState({loading: false, error: null})

    const handleButton = async () => {
        setModal({...modal, loading: true})
        await testToken()
        if(!auth.user.verified){
          setModal({error: "You didn't verify your email",loading: false})
          setTimeout(() => setModal({...modal,error: null}), 2500)
        }
    }

    const handleResend = async () => {
        try{
            const res = await axios.post(`${process.env.REACT_APP_AUTH_API}/user/verify/resend`)
            setModal({...modal, text: "Email Sent"})
            setTimeout(() => setModal({...modal,text: null}), 2500)

        } catch (err){
            setModal({error: "An error occured resending",loading: false})
            setTimeout(() => setModal({...modal,error: null}), 2500)
        }
    }

    return (
    <>
        {history.location.pathname.split("/")[1] != 'verify' &&
        <>
        {auth.user &&
            <Modal footer={<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                    {modal.error ? <Text type={"danger"}>{modal.error}</Text> : <Text> {modal.text || <a onClick={handleResend}>Resend Email</a>}</Text>}
              </div>
              <Button type='primary' onClick={handleButton} loading={modal.loading}>Continue</Button>
            </div>} title="Email Verification" visible={auth.user.role == 'teacher' && !auth.user.verified}>
                <Text>To ensure application security, we require that teachers verify their email. Please check your inbox and junk folder, and press continue once you've verified your email.</Text>
            </Modal>
        }
        </>
        }
    </>
  );
}

export default Navbar;
