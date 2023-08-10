import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Typography, Avatar, PageHeader } from 'antd';

import AuthContext from "../../contexts/AuthContext";

const { Text, Title } = Typography;

const Header = ({ club, leaveClub, joinClub, history }) => {

    const { auth, setAuth } = useContext(AuthContext);

    const navigateAndRefresh = (path) => {
        history.push(path);
        window.location.reload();
    }

    const pageHeaderLogic = () => {
        if (!auth.user || !club) {
            return [
                <Text style={{ cursor: 'pointer' }} onClick={() => navigateAndRefresh(`/login?redirect=/clubs/${club.url}?autojoin=true`)}>Join Club</Text>,
                <Avatar size={50} shape="round" src={club.logo} ></Avatar>
            ]
        } else {
            const userIsMember = club.members.includes(auth.user.localAccountId);
            const userIsOfficer = club.officers.includes(auth.user.localAccountId);
            const userIsSponser = club.sponsors.includes(auth.user.localAccountId);
            const userIsApplicant = club.applicants.includes(auth.user.localAccountId);

            if (userIsMember) {
                return [
                    <Text type="danger" style={{ cursor: 'pointer' }} onClick={leaveClub}> Leave Club</Text>,
                    <Avatar size={50} shape="round" src={club.logo} ></Avatar>
                ]
            } else if (userIsOfficer || userIsSponser) {
                return [
                    <Text style={{ cursor: 'pointer' }} onClick={() => navigateAndRefresh(`/clubs/${club.url}/settings`)}> Manage Club</Text>,
                    <Avatar size={50} shape="round" src={club.logo} ></Avatar>
                ]
            } else if (userIsApplicant) {
                return [
                    <Text>Pending Application</Text>,
                    <Avatar size={50} shape="round" src={club.logo} ></Avatar>
                ]
            } else {
                return [
                    <Text style={{ cursor: 'pointer' }} onClick={() => { joinClub(); navigateAndRefresh(window.location.pathname); }}> Join Club</Text>,
                    <Avatar size={50} shape="round" src={club.logo} ></Avatar>
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
                    <Title level={2} style={{ marginBottom: "0px" }}> {club.name}</Title>
                </div>
            }
            extra={pageHeaderLogic()}
        >
        </PageHeader>
    )
}

export default Header;
