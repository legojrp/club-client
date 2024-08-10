# Verify Component

The `Verify` component provides a user interface for resetting a user's password after verifying their email. It captures the new password and verification token, performs validation, and submits the data to a backend API.

## Import Statements

```javascript
import React, { useEffect, useState } from 'react';
import { CloseOutlined, LockOutlined, CheckCircleTwoTone, LoadingOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { Card, Typography, Input, Button } from 'antd';
import axios from 'axios';
import logo from '../img/hsekey.png';
```

### Dependencies

- **React**: The base library for building the user interface.
- **React Router DOM**: For managing navigation and URL parameters.
- **Ant Design (antd)**: A React UI library for styling and components.
- **axios**: For making HTTP requests to the backend.

## Component State

- **loading**: Boolean state to indicate if the request is in progress.
- **updated**: Boolean state to indicate if the password has been successfully updated.
- **error**: Boolean state to indicate if an error occurred during the password update.
- **formData**: Object storing user input for `password` and `vpassword` (verify password).
- **errors**: Array to store any validation or server-side errors.

## Component Structure

### Layout

- The component is centered on the page using a flexbox layout.
- The `Card` component from Ant Design wraps the content to give it a neat and organized appearance.

### Title and Logo

- **Title**: Displays "Password Reset" at the top of the card.
- **Logo**: A small logo image is displayed next to the title.

### Input Fields

- Two input fields are provided:
  - **New Password**: Captures the user’s new password.
  - **Verify Password**: Requires the user to re-enter their new password for confirmation.

### Error Handling

- **Validation Errors**: Basic form validation is performed before submitting the data. Errors are displayed directly beneath the input fields.
- **Server Errors**: If the password reset fails, the server response is checked for errors and displayed to the user.

### Button

- **Update Password Button**: A primary button labeled "Update Password" triggers the password reset process. It shows a loading spinner when the request is in progress.

### Success/Error Messages

- **Success Message**: If the password reset is successful, a success message is displayed along with a link to the login page.
- **Error Message**: If an error occurs, an error message is displayed along with a link to the login page.

## Functions

### useEffect Hook

- **Purpose**: Sets the document title to "HSE Key | Signup" when the component is mounted.

### handleForm(e)

- **Purpose**: Updates the `formData` state whenever a user types into an input field.

### sendEmail()

- **Purpose**: Validates the form data, sends a PUT request to the backend to update the user's password, and displays the appropriate success or error message.
- **Validation**: Checks for missing fields, password length, and password match before submitting.
- **API Request**: Sends the new password and token to the backend API. If successful, it updates the `updated` state to `true`.
- **Error Handling**: Displays validation or server-side errors.

### URL Parameters

- **token**: Extracted from the URL using the `useParams` hook, it is used to verify the user’s identity before allowing a password reset.

## Example Usage

```javascript
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Verify from './components/Verify';

const App = () => (
  <Router>
    <Route path="/verify/:token" component={Verify} />
  </Router>
);

export default App;
```

## Additional Notes

- **Responsiveness**: The layout is designed to be centered and responsive across different screen sizes.
- **User Experience**: The component provides immediate feedback to the user about the success or failure of their password reset attempt.
- **Error Display**: Errors are displayed dynamically and cleared automatically after 2.5 seconds.
- **Navigation**: After successfully updating the password or encountering an error, the user can navigate to the login page via a provided link.
