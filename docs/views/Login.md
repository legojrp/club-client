# Login Component

The `Login` component provides a user interface for users to log in to their accounts. It captures the user's email and password, performs basic validation, and submits the credentials to a backend API for authentication.

## Import Statements

```javascript
import React, { useContext, useEffect, useState } from 'react';
import { UserOutlined, LockOutlined, CloseOutlined } from '@ant-design/icons';
import { Card, Typography, Input, Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';
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

- **auth**: Context state to manage authentication status.
- **formData**: Object storing user input for `email` and `password`.
- **loading**: Boolean state to indicate if the login request is in progress.
- **errors**: Array to store any validation or server-side errors.

## Component Structure

### Layout

- The component is centered on the page using a flexbox layout.
- The `Card` component from Ant Design wraps the content to give it a neat and organized appearance.

### Title and Logo

- **Title**: Displays "Login" at the top of the card.
- **Logo**: A small logo image is displayed next to the title.

### Input Fields

- Two input fields are provided:
  - **Email**: Captures the user’s email address.
  - **Password**: Captures the user’s password.

### Error Handling

- **Validation Errors**: Basic form validation is performed before submitting the data. Errors are displayed directly beneath the input fields.
- **Server Errors**: If the login attempt fails, the server response is checked for errors and displayed to the user.

### Button

- **Login Button**: A primary button labeled "Login" triggers the login process. It shows a loading spinner when the request is in progress.

### Links

- **Forgot Password**: A link to the forgot password page is provided.
- **Sign Up**: A link to the sign-up page is provided for users who don’t have an account.

## Functions

### useEffect Hook

- **Purpose**: Sets the document title to "HSE Key | Login" when the component is mounted.

### handleForm(e)

- **Purpose**: Updates the `formData` state whenever a user types into an input field.

### login()

- **Purpose**: Validates the form data, sends a POST request to the backend to authenticate the user, and handles the response.
- **Validation**: Checks for missing email or password fields before submitting.
- **API Request**: Sends the email and password to the backend API. If successful, it updates the `auth` context and stores the authentication token in `localStorage`. It then redirects the user based on the `redirect` URL parameter, or to the homepage if no redirect is specified.
- **Error Handling**: Displays validation or server-side errors.

### Redirect Handling

- **Redirect**: Extracts a `redirect` URL parameter from the query string. If provided, it redirects the user to this URL after a successful login.

## Example Usage

```javascript
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';

const App = () => (
  <Router>
    <Route path="/login" component={Login} />
  </Router>
);

export default App;
```

## Additional Notes

- **Responsiveness**: The layout is designed to be centered and responsive across different screen sizes.
- **User Experience**: The component provides immediate feedback to the user about the success or failure of their login attempt.
- **Error Display**: Errors are displayed dynamically and cleared automatically after 2.5 seconds.
- **Navigation**: After successfully logging in or encountering an error, the user can navigate to the appropriate pages via provided links.
