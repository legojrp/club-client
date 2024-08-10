# `ApplicationMenu` Component

The `ApplicationMenu` component is used for managing club applications, including accepting new members and updating application settings. It integrates with Ant Design's components for user interface elements and Axios for API requests.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products.
- **axios**: A promise-based HTTP client for making API requests.

## Component Structure

### Imports

```javascript
import React, { useState, useContext } from 'react';
import { Divider, List, Tooltip, Avatar, Button, Typography, Switch, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import ClubContext from '../../util/ClubContext';
import axios from 'axios';
```

### Props

- **updateClub** (`function`): Function to update the club information.
- **form** (`object`): Contains form data, including club settings.
- **club** (`object`): The current club object.
- **setForm** (`function`): Function to update form state.
- **clubMembers** (`object`): Contains arrays of current members and applicants.
- **errors** (`array`): Array of error messages.
- **setErrors** (`function`): Function to update error messages.
- **edited** (`boolean`): Indicates whether changes have been made.
- **setEdited** (`function`): Function to set the edited state.
- **setClub** (`function`): Function to update the club state.
- **setClubMembers** (`function`): Function to update the club members state.

### State

- **clubContext** (`object`): Context object containing club data.
- **setClubContext** (`function`): Function to update the club context.

### Usage

The `ApplicationMenu` component allows users to:

- Manage application settings, including whether students can join automatically.
- Accept new members into the club from the list of applicants.
- Update the club information and save changes.

### JSX Structure

```javascript
const ApplicationMenu = ({ updateClub, form, club, setForm, clubMembers, errors, setErrors, edited, setEdited, setClub, setClubMembers }) => {
    const { clubContext, setClubContext } = useContext(ClubContext);

    const acceptMember = async (idToAdd) => {
        try {
            const clubRes = await axios.put(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/members/${idToAdd}/accept`);
            
            const clubData = clubRes.data;
            
            setClub(clubRes.data);
            setClubContext({ ...clubContext, [club.url]: clubData });
            const userToAdd = clubMembers.applicants.find((user) => user._id === idToAdd);

            setClubMembers({
                ...clubMembers,
                applicants: clubMembers.applicants.filter((user) => user._id !== idToAdd),
                members: [userToAdd].concat(clubMembers.members),
            });
            message.success('Club member accepted', 5);

        } catch (err) {
            console.log(err.msg);
            setErrors([{ "msg": "Server error" }]);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            {clubMembers?.officers && (
                <div style={{ width: "95%" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <Divider orientation="left" plain>Application Settings</Divider>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ width: "85%" }}>
                                <Text>Allow students to join without being manually accepted</Text>
                            </div>
                            <Switch
                                checked={form.settings.autoJoin}
                                onChange={() => {
                                    setEdited(true);
                                    setForm({ ...form, settings: { ...form.settings, autoJoin: !form.settings.autoJoin } });
                                }}
                            />
                        </div>
                    </div>
                    <List
                        header="Applicants"
                        itemLayout="horizontal"
                        dataSource={clubMembers.applicants}
                        renderItem={member => (
                            <List.Item
                                actions={[
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="Accept">
                                            <UserAddOutlined onClick={() => acceptMember(member._id)} style={{ fontSize: "18px", color: "#52c41a", cursor: "pointer" }} />
                                        </Tooltip>
                                    </div>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar size={45} src={member.profilePictureURL} />}
                                    title={member.name}
                                    description={<Text editable>{club.titles[member._id] || "Applicant"}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                    <div style={{ width: "100%", display: "flex", marginTop: "80px" }}>
                        <div style={{ paddingLeft: "20px", marginLeft: "100px", width: "calc(100% - 100px)", display: "flex", justifyContent: "center" }}>
                            <div style={{ width: "95%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                {errors.length > 0 && <Text type="danger">{errors[0].msg}</Text>}
                                {edited && <Button style={{ marginLeft: "15px" }} onClick={updateClub} type='primary'>Save</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationMenu;
```

### Example Usage

```javascript
import React, { useState } from 'react';
import ApplicationMenu from './ApplicationMenu';

const Example = () => {
    const [club, setClub] = useState({});
    const [form, setForm] = useState({ settings: { autoJoin: false } });
    const [clubMembers, setClubMembers] = useState({ applicants: [], members: [] });
    const [errors, setErrors] = useState([]);
    const [edited, setEdited] = useState(false);

    const updateClub = () => {
        // Update club logic
    };

    return (
        <ApplicationMenu
            updateClub={updateClub}
            form={form}
            club={club}
            setForm={setForm}
            clubMembers={clubMembers}
            errors={errors}
            setErrors={setErrors}
            edited={edited}
            setEdited={setEdited}
            setClub={setClub}
            setClubMembers={setClubMembers}
        />
    );
};

export default Example;
```

## Styling

- **Modal**:
  - `title`: Displays the club logo and the title "Post Announcement".
  - `visible`: Controls the visibility of the modal.
  - `okText`: Text for the OK button, set to "Send".
  - `onCancel`: Closes the modal.

- **List**:
  - `header`: Contains a title and a button for creating a new announcement.
  - `itemLayout`: Set to `"horizontal"` to align items in a horizontal layout.

- **Avatar**:
  - `size`: Set to `35` for a smaller avatar size.
  - `style`: Includes margin and border radius for styling.

- **Button**:
  - `style`: Set to cursor `"pointer"` for clickable behavior.