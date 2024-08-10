# `AvatarUpload` Component

The `AvatarUpload` component provides a user interface for uploading an avatar image. It combines Ant Design's `Upload` and `Avatar` components to allow users to select and upload an image, with a button to trigger the upload action.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products.
- **@ant-design/icons**: Provides icons used within the Ant Design framework.

## Component Structure

### Imports

```javascript
import React from 'react';
import { Avatar, Button, Badge, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
```

### Props

- **avatar** (`string`): The URL or base64 data of the avatar image to display. If not provided, a default empty avatar is shown.
- **changeHandeler** (`function`): Callback function to handle changes in the upload process. It receives the upload event information as an argument.

### Usage

The `AvatarUpload` component displays an avatar image that can be updated by uploading a new image. The upload button is overlaid on the avatar, allowing users to select a file for upload.

### JSX Structure

```javascript
const AvatarUpload = ({ avatar, changeHandeler }) => {
    const props = {
        name: 'file',
        action: `${process.env.REACT_APP_AUTH_API}/static`,
        onChange(info) {
            changeHandeler(info);
        },
        showUploadList: false,
    };

    return (
        <Upload {...props}>
            <Badge offset={[-20, 10]} style={{ background: "White" }} count={
                <Button style={{ background: "White" }} shape="circle">
                    <UploadOutlined />
                </Button>
            }>
                <Avatar size={100} style={{ border: "0.5px solid #eee" }} src={avatar ? avatar : ""} />
            </Badge>
        </Upload>
    );
};

export default AvatarUpload;
```

### Example Usage

```javascript
import React, { useState } from 'react';
import AvatarUpload from './AvatarUpload';

const Example = () => {
    const [avatar, setAvatar] = useState(null);

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            setAvatar(info.file.response.url); // Update avatar with response URL
        }
    };

    return (
        <AvatarUpload avatar={avatar} changeHandeler={handleChange} />
    );
};

export default Example;
```

## Styling

- **Avatar**:
  - `size`: Set to `100` to define the size of the avatar.
  - `style`: Includes a border with `0.5px solid #eee` for a light border around the avatar.

- **Badge**:
  - `offset`: Adjusts the position of the badge. `[-20, 10]` moves it upwards and slightly to the right.
  - `style`: Sets the background color to white.

- **Button**:
  - `shape`: Set to `"circle"` for a round button.
  - `style`: Background color set to white.

- **Upload**:
  - `showUploadList`: Set to `false` to hide the default upload list.