import React from "react";
import { Link } from "react-router-dom";

import {
  CalendarFilled,
  CalendarOutlined,
  CalendarTwoTone,
  setTwoToneColor,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Menu,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import logo from "../img/icon.jpeg";

const { Title, Text, Paragraph } = Typography;

const Navbar = ({ clubData }) => {
  const {
    name,
    color,
    description,
    sponsors,
    logo,
    url,
    members,
    officers,
    tags,
    tagline,
    _id,
  } = clubData;
  return (
    <Link to={"/clubs/" + url}>
      <Card
        key={_id}
        style={{
          width: "27rem",
          borderRadius: "1.5rem",
          height: "15rem",
          margin: "0px 2rem 2rem 0px",
        }}
        hoverable
        loading={false}
      >
        <Row>
          <Col span={17}>
            <Title level={4}>{name}</Title>
            <div>
              {tags.map((tag) => (
                <Tag style={{ marginBottom: "8px" }} color={color}>
                  {tag}
                </Tag>
              ))}
            </div>
          </Col>
          <Col span={6} offset={1} align="right">
            <Avatar
              src={logo}
              style={{ borderRadius: "15px" }}
              size={70}
            ></Avatar>
          </Col>
        </Row>
        <Paragraph
          style={{ marginTop: "13px", fontSize: "16px", height: "50px" }}
        >
          {tagline}
        </Paragraph>
        <div style={{ height: "20rem" }}>
          <Text style={{ bottom: 0 }}>
            <UserOutlined></UserOutlined>{" "}
            {members.length + officers.length + sponsors.length}{" "}
          </Text>
        </div>
      </Card>
    </Link>
  );
};

export default Navbar;
