# `ClubSettings` Component

The `ClubSettings` component is used for registering a new club with various details such as name, logo, description, and contact information. It includes form inputs for club information, a file upload for the club's logo, and settings for club management. This component uses React, Ant Design, and Framer Motion for UI and animations.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products.
- **Framer Motion**: A library for animations in React.
- **Axios**: A promise-based HTTP client for making API requests.

## Component Structure

### Imports

```javascript
import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../util/Navbar';
import { Row, Col, Typography, PageHeader, Card, Input, Divider, message, Button, Switch } from 'antd';
import { Avatar, Upload } from 'antd';
import { VideoCameraOutlined, LinkOutlined, MailOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';
import AuthContext from '../contexts/AuthContext';
import ClubContext from '../util/ClubContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import TagSelector from './SharedComponents/TagSelector';
import AvatarUpload from './SharedComponents/AvatarUpload';
```

### State Management

- **auth**: Authentication context for managing user authentication status.
- **club**: State for holding the current club data.
- **clubMembers**: State for holding club members data.
- **menu**: State to manage which menu item is currently active.
- **form**: State to manage form data for creating a club.
- **errors**: State to manage and display form validation errors.
- **edited**: State to track if any changes have been made to the form.

### Hooks

- **useEffect**: Initializes form data when the component mounts and when `auth` changes.
- **useContext**: Retrieves and sets authentication and club context.

### Event Handlers

- **handleForm**: Updates form data when an input field changes.
- **handleContactForm**: Updates contact information in the form.
- **submitClub**: Submits the form data to the server and handles the response.

### File Upload Props

- **props**: Configuration for file upload, including the action URL and headers.

### JSX Structure

- **Navbar**: Displays the navigation bar at the top.
- **Row and Col**: Layout components to structure the page.
- **PageHeader**: Displays the header with the title and extra information.
- **Card**: Contains the main content of the page, including form fields and buttons.
- **AvatarUpload**: Component for uploading the club logo.
- **TagSelector**: Component for selecting tags related to the club.
- **Input and TextArea**: Form fields for various pieces of information.
- **Button**: Submit button for registering the club.
- **Switch**: Toggle switch for allowing automatic joining of the club.

## Example Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import ClubSettings from './components/ClubSettings';

ReactDOM.render(<ClubSettings />, document.getElementById('root'));
```

## API Endpoints

- **POST `/club/`**: Submits the form data to create a new club. Requires the `msId` (Microsoft Account ID) and `form` data.

## Props

- **history**: Provides history object for navigation.

## Styling

- The component uses inline styles and Ant Design's styling to ensure responsiveness and a modern design.

## Error Handling

- Displays error messages if the submission fails or if there are validation issues with the form data.