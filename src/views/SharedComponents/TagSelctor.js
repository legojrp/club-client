import React, {Fragment} from 'react'

import {Select} from 'antd'

const { Option } = Select;


const TagSelector = ({handleSelect, handleDeselect, defaultValue, value, className, placeholder}) => {


    return(
    <Select
        className = {className || null}
        value={value}
        mode="multiple"
        style={{ width: '100%', margin: "10px 0px" ,  border: "none"}}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onSelect={(e) => handleSelect(e)}
        onDeselect={(e) => handleDeselect(e)}
        
    >
        <Option key="Academics"> Academics </Option>
        <Option key="Art"> Art </Option>
        <Option key="Athletics"> Athletics </Option>
        <Option key="Business"> Business </Option>
        <Option key="Competition"> Competition </Option>
        <Option key="Cultural"> Cultural </Option>
        <Option key="Cooking"> Cooking </Option>
        <Option key="Diversity"> Diversity </Option>
        <Option key="Gaming"> Gaming </Option>
        <Option key="Mentorship"> Mentorship </Option>
        <Option key="Politics"> Politics </Option>
        <Option key="Programming"> Programming </Option>
        <Option key="Religion">Religion</Option>
        <Option key="Science">Science</Option>
        <Option key="Theater"> Theater </Option>
        <Option key="Technology"> Technology </Option>
        <Option key="Volunteering"> Volunteering </Option>
    </Select>
    )
}

export default TagSelector