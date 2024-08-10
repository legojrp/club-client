# Signup Component

The `Signup` component provides a user interface for new users to sign up for an account. It captures user input for name, email, and password, performs validation, and submits the data to a backend API.

## Import Statements

```javascript
import React, { useContext, useEffect, useState } from 'react';
import { UserOutlined, LockOutlined, CloseOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
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
- **AuthContext**: Context for managing authentication state.

## Component State

- **auth**: Managed through `AuthContext`, it keeps track of the authentication state.
- **formData**: Object storing user input for `email`, `password`, `vpassword` (verify password), and `name`.
- **errors**: Array to store any validation or server-side errors.
- **loading**: Boolean state to indicate if the signup request is in progress.

## Component Structure

### Layout

- The component is centered on the page using a flexbox layout.
- The `Card` component from Ant Design wraps the content to give it a neat and organized appearance.

### Title and Logo

- **Title**: Displays "Sign Up" at the top of the card.
- **Logo**: A small logo image is displayed next to the title.

### Input Fields

- Four input fields are provided:
  - **Name**: Captures the user’s name.
  - **Email**: Captures the user’s email address.
  - **Password**: Captures the user’s password.
  - **Verify Password**: Requires the user to re-enter their password for confirmation.

### Error Handling

- **Validation Errors**: Basic form validation is performed before submitting the data. Errors are displayed directly beneath the input fields.
- **Server Errors**: If the signup fails, the server response is checked for errors and displayed to the user.

### Button

- **Signup Button**: A primary button labeled "Signup" triggers the signup process. It shows a loading spinner when the request is in progress.

### Navigation

- **Login Link**: A link is provided to navigate to the login page if the user already has an account.

## Functions

### useEffect Hook

- **Purpose**: Sets the document title to "HSE Key | Signup" when the component is mounted.

### handleForm(e)

- **Purpose**: Updates the `formData` state whenever a user types into an input field.

### signup()

- **Purpose**: Validates the form data, sends a POST request to the backend to create a new user, and updates the authentication context on success.
- **Validation**: Checks for missing fields, email format, and password match before submitting.
- **API Request**: Sends user data to the backend API. If successful, it stores the returned token in `localStorage` and redirects the user to either the specified redirect URL or the home page.
- **Error Handling**: Displays validation or server-side errors.

### Redirect Handling

- The `redirect` variable extracts any redirect URL from the current URL's query parameters. After successful signup, the user is redirected to this URL if provided.

## Example Usage

```javascript
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Signup from './components/Signup';

const App = () => (
  <Router>
    <Route path="/signup" component={Signup} />
  </Router>
);

export default App;
```

## Additional Notes

- **Responsiveness**: The layout is designed to be centered and responsive across different screen sizes.
- **User Experience**: The component provides immediate feedback to the user about the success or failure of their signup attempt.
- **Error Display**: Errors are displayed dynamically and cleared automatically after 2.5 seconds.
