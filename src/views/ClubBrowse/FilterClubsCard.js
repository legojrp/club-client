import React, { useEffect, useState } from 'react'

import {Select, Input, Card, Typography, Tag} from 'antd'
import { UserOutlined, TagOutlined, SearchOutlined} from '@ant-design/icons';

import TagSelector from '../SharedComponents/TagSelctor'

const {Option} = Select

const {Text} = Typography






function tagRender(props) {
    const { label, value, closable, onClose } = props;
    return (
      <Tag color={ value.substring(0,1) == "A" ? "red" : "blue"} closable={closable} onClose={onClose} style={{margin:"2px 2px"}}>
        {label}
      </Tag>
    );
  }





const FilterClubsCard = ({ clubs, setFilteredClubs}) => {

    const [filter, setFilter] = useState({tags:[], sizes:[]})


    useEffect(() => {
        if(clubs){
            filterClubs()
        }
    }, [filter])

    const handleFilter = (e, options) => {
        if(options.type === "tag"){
            if(options.action === "add"){
                const newTags = filter.tags.concat([e])
                setFilter({...filter, tags: newTags})
            } else {
                const newTags = filter.tags.filter((tag) => tag != e)
                setFilter({...filter, tags: newTags})
            }
        } else if (options.type === "size"){
            if(options.action === "add"){
                const newSizes = filter.sizes.concat([e])
                setFilter({...filter, sizes: newSizes})
            } else {
                const newSizes = filter.sizes.filter((size) => size != e)
                setFilter({...filter, sizes: newSizes})
            }
        }
    }


    const filterClubs = () => {
        console.log(filter)
        const filteredClubs = clubs.filter((club) => {
            let tagFlag = false
            if(filter.tags.length == 0){
                tagFlag = true 
            } else {
                tagFlag = club.tags.some((tag) => filter.tags.includes(tag))
            }

            let sizeFlag = false 
            const clubTotalMembers = club.officers.length + club.members.length + club.sponsors.length
            let clubSize;
            if(clubTotalMembers > 100) {
                clubSize = 'Very Large'
            } else if (clubTotalMembers > 50){
                clubSize = 'Large'
            } else if (clubTotalMembers > 25){
                clubSize = 'Medium'
            } else {
                clubSize = 'Small'
            }
            if(filter.sizes.length == 0){
                sizeFlag = true 
            } else {
                sizeFlag = filter.sizes.some((size) => size == clubSize)
            }
            

            let searchFlag = false
            if(filter.search){
                if(club.name.toLowerCase().indexOf(filter.search.toLowerCase()) != -1){
                    searchFlag = true
                }
            } else {
                searchFlag = true
            }

            return tagFlag && (sizeFlag && searchFlag)
        })
        setFilteredClubs(filteredClubs)
    }


    return (
        <Card title="Filter Clubs" bordered={true} style={{ width: "100%", margin: "40px 20px 10px 20px ", borderRadius: "20px" }}>
                <Input style={{ margin: "10px 0px 20px 0px"}} suffix={<SearchOutlined style={{marginRight: "0px"}}></SearchOutlined>}  onChange={e => setFilter({...filter, search: e.target.value})} placeholder="Search clubs"></Input>

                <Text style={{margin: "0px"}}> <TagOutlined style={{marginRight: "5px", marginLeft: "2px"}} /> Tags </Text>

                <TagSelector 
                    value={filter.tags}
                    handleSelect={(e) => handleFilter(e, {action: "add", type: "tag"})}  
                    handleDeselect={(e) => handleFilter(e, {action: "remove", type: "tag"})} 
                    defaultValue={[]}
                    placeholder="Filter by tags"
                />



                
                <br></br>
                <Text> <UserOutlined style={{marginRight: "5px", marginLeft: "2px"}} /> Club Size </Text>
                <Select
                    mode="multiple"
                    style={{ width: '100%', margin: "10px 0px" }}
                    placeholder="Filter by size"
                    defaultValue={[]}
                    onSelect={(e) => handleFilter(e, {action: "add", type: "size"})}
                    onDeselect={(e) => handleFilter(e, {action: "remove", type: "size"})}
                >
                    <Option key="Small"> Small (1-25) </Option>
                    <Option key="Medium"> Medium (26-50) </Option>
                    <Option key="Large"> Large (51-100) </Option>
                    <Option key="Very Large"> Very Large (100+) </Option>
                </Select>
        </Card>
    )
}

export default FilterClubsCard