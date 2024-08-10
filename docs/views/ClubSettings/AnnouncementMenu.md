# `AnnouncementMenu` Component

The `AnnouncementMenu` component provides a user interface for displaying and creating announcements within a club or organization. It integrates with Ant Design's `List`, `Modal`, `Avatar`, and other components to present announcements and allow users to post new ones.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products.
- **moment**: A JavaScript library for handling dates and times.
- **axios**: A promise-based HTTP client for making API requests.

## Component Structure

### Imports

```javascript
import React, { useState } from 'react';
import { List, Tooltip, Typography, message, Avatar, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
```

### Props

- **club** (`object`): The club or organization object, containing properties such as `url`, `logo`, `members`, `officers`, and `settings`.
- **auth** (`object`): Authentication object, containing user information such as `name`.
- **announcements** (`array`): Array of announcement objects to be displayed.
- **setAnnouncements** (`function`): Function to update the announcements state.

### State

- **modal** (`object`): Manages the state of the modal, including whether it is open or closed, and the content of the announcement being created.

### Usage

The `AnnouncementMenu` component allows users to view existing announcements and post new ones. The modal provides an input area for composing a new announcement, and the list displays all current announcements.

### JSX Structure

```javascript
const AnnouncementMenu = ({ club, auth, announcements, setAnnouncements }) => {
    const [modal, setModal] = useState({ open: false });

    const makeAnnouncement = async () => {
        try {
            const clubRes = await axios.post(`${process.env.REACT_APP_CLUB_API}/club/${club.url}/announcement/`, { message: modal.message });
            
            if (clubRes.data) {
                setModal({ open: false });
                message.success("Message Sent", 5);
                setAnnouncements([{ message: modal.message, date: Date.now(), senderName: auth.user.name }, ...announcements]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {announcements && (
                <>
                    <Modal
                        title={
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                <Avatar src={club?.logo} size={35} style={{ marginRight: "15px", borderRadius: "10px" }} />
                                <Text>Post Announcement</Text>
                            </div>
                        }
                        visible={modal.open}
                        onOk={makeAnnouncement}
                        okText={"Send"}
                        onCancel={() => setModal({ open: false })}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Input.TextArea
                                onChange={(e) => setModal({ ...modal, message: e.target.value })}
                                placeholder='Your message'
                                value={modal.message}
                            />
                            <Text strong>{club.members.length + club.officers.length - club.settings.smsDisabled} will receive an SMS notification</Text>
                        </div>
                    </Modal>
                    <div style={{ width: "100%", display: "flex" }}>
                        <List
                            style={{ width: '100%' }}
                            header={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Text>Announcements</Text>
                                    <Tooltip title="New announcement">
                                        <PlusOutlined onClick={() => setModal({ open: true })} style={{ cursor: 'pointer' }} />
                                    </Tooltip>
                                </div>
                            }
                            itemLayout="horizontal"
                            dataSource={announcements}
                            renderItem={announcement => (
                                <List.Item
                                    actions={[moment(announcement.date).calendar()]}
                                >
                                    <List.Item.Meta
                                        title={announcement.senderName}
                                        description={<Text>{announcement.message}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default AnnouncementMenu;
```

### Example Usage

```javascript
import React, { useState } from 'react';
import AnnouncementMenu from './AnnouncementMenu';

const Example = () => {
    const [announcements, setAnnouncements] = useState([]);
    const auth = { user: { name: "John Doe" } };
    const club = {
        url: "example-club",
        logo: "https://example.com/logo.png",
        members: [1, 2, 3],
        officers: [1],
        settings: { smsDisabled: 0 }
    };

    return (
        <AnnouncementMenu
            club={club}
            auth={auth}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
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
