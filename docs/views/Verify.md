# Verify Component

The `Verify` component is responsible for verifying a user's email address through a token sent to their email. It provides feedback to the user on whether the verification was successful or if the verification link has expired.

## Import Statements

```javascript
import React, { useEffect, useState } from 'react';
import { UserOutlined, LockOutlined, CheckCircleTwoTone, LoadingOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { Card, Typography, Input, Button } from 'antd';
import AuthContext from '../contexts/AuthContext';
import logo from '../img/hsekey.png';
import axios from 'axios';
```

### Dependencies

- **React**: The base library for building the user interface.
- **React Router DOM**: For managing navigation and URL parameters.
- **Ant Design (antd)**: A React UI library for styling and components.
- **axios**: For making HTTP requests to the backend.

## Component State

- **loading**: Boolean state to track if the verification process is ongoing.
- **error**: Boolean state to indicate if there was an error during the verification process.

## Component Structure

### Layout

- The component is centered on the page, providing a clean and simple UI for the verification process.
- The `Card` component from Ant Design is used to wrap the content and give it a neat appearance.

### Title and Logo

- **Title**: The title "HSE Key" is displayed at the top of the card.
- **Logo**: A logo image is displayed next to the title, which can be clicked to toggle the `loading` state (likely for testing purposes).

### Verification Process

- The verification process is initiated in the `useEffect` hook, which calls the `verify` function when the component mounts.
- The `verify` function sends a POST request to the backend API with the token extracted from the URL parameters.

### Conditional Rendering

- **Loading State**: While the verification request is being processed, a loading spinner (`LoadingOutlined`) is displayed.
- **Success State**: If the verification is successful, a success icon (`CheckCircleTwoTone`) and a message indicating that the email has been verified are displayed.
- **Error State**: If the verification fails (e.g., if the token has expired), an error icon (`CloseCircleTwoTone`) and a message indicating that the link has expired are displayed.

### Navigation

- In both the success and error states, a link is provided to navigate back to the home page.

## Functions

### useEffect Hook

- **Purpose**: Sets the document title and triggers the email verification process when the component is mounted.

### verify()

- **Purpose**: Sends an HTTP POST request to the backend API with the token to verify the user's email.
- **Success**: On success, it stops the loading state.
- **Error**: On error, it stops the loading state and sets the error state to `true`.

## Example Usage

```javascript
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Verify from './components/Verify';

const App = () => (
  <Router>
    <Route path="/verify/:emailToken" component={Verify} />
  </Router>
);

export default App;
```

## Additional Notes

- **Responsiveness**: The component uses flexbox for layout, ensuring that the UI is responsive and centered on the screen.
- **User Experience**: The use of visual feedback (icons and text) ensures that the user is informed of the verification status in a clear and concise manner.
- **Customization**: The styles, icons, and messages can be easily customized to fit the branding and design of the application.
