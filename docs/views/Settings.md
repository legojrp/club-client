# Settings Component

The `Settings` component provides a user interface for managing user account settings. It includes options for updating user information, opting into an early adopter program, and logging out.

## Import Statements

```javascript
import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../util/Navbar';
import { useParams, useLocation } from 'react-router-dom';
import SettingsNav from './SharedComponents/SettingsNav';
import {
    Row, Col, Typography, PageHeader, Card, Select, Avatar, Menu, Button, Input, Switch, Divider, message, Tooltip
} from 'antd';
import { UserOutlined, LogoutOutlined, CheckCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import AuthContext from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import AvatarUpload from './SharedComponents/AvatarUpload';
```

### Dependencies

- **React**: The base library for building the user interface.
- **React Router DOM**: For managing navigation and URL parameters.
- **Ant Design (antd)**: A React UI library for styling and components.
- **Framer Motion**: A library for animations in React.
- **axios**: For making HTTP requests to the backend.
- **AuthContext**: Custom context for managing authentication state.
- **AvatarUpload**: A custom component for uploading and managing avatars.

## Component State

- **auth**: Authentication state retrieved from `AuthContext`, including user data.
- **setAuth**: Function to update authentication state.
- **activeKey**: Tracks the active menu item in the settings navigation.
- **form**: State for storing form data (e.g., name, email, phone).
- **errors**: Array to store validation or server errors.
- **edited**: Boolean flag to track if the form has been edited.

## Component Structure

### Navbar

- The `Navbar` component is included at the top of the settings page for consistent navigation across the app.

### Page Layout

- **`Row` and `Col`:** Ant Design grid components are used for layout. The settings page is centered on the screen.

### Page Header

- **`PageHeader`:** Displays the title "Settings" with a back button to return to the previous page.

### Settings Navigation

- **`SettingsNav`:** A custom component for navigating between different settings sections.
  - **`Menu.Item` (info):** Displays "My Account" with a user icon.
  - **`Menu.Item` (logout):** Displays "Logout" with a logout icon and triggers the `logout` function.

### User Information Form

- **AvatarUpload**: Custom component for uploading and displaying the user's avatar.
- **Input Fields**:
  - **Name**: Editable text field for the user's name.
  - **Email**: Non-editable text field for the user's email with a verification status indicator.
  - **Phone**: Editable text field for the user's phone number.
  - **Class**: Editable text field for the user's class, visible only if the user’s role is "teacher".

### Early Adopter Program

- **Switch**: Toggle switch for opting into the early adopter program, allowing users to receive features earlier.

### Save Button

- **Save**: A button that triggers the `updateUser` function to save the user's updated information.

## Functions

### logout()

Logs the user out by clearing the authentication state and redirecting to the home page.

### handleForm(e)

Handles changes in form input fields and updates the form state accordingly. Sets the `edited` flag to `true` when changes are detected.

### updateUser()

Sends an HTTP PUT request to update the user's information. On success, it updates the authentication state with the new user data and displays a success message. On failure, it displays error messages.

### useEffect Hook

Monitors changes in the `auth` state and initializes the form data when the component is mounted or when the `auth` state changes.

## Example Usage

```javascript
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Settings from './components/Settings';

const App = () => (
  <Router>
    <Route path="/settings" component={Settings} />
  </Router>
);

export default App;
```

## Additional Notes

- **Responsive Design:** The component uses Ant Design's grid system to ensure that the layout is responsive.
- **Error Handling:** The `errors` state and `message` component from Ant Design are used to display errors and success messages to the user.
- **Customization:** The component can be customized by modifying the input fields, layout, or styles.