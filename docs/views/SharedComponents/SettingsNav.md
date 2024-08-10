# `SettingsNav` Component

The `SettingsNav` component is a navigation menu wrapped in an Ant Design `Card`. It is designed to display a list of menu items and handle click events.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products.

## Component Structure

### Imports

```javascript
import React from 'react';
import { Card, Menu } from 'antd';
```

### Props

- **children** (`node`): The content to be rendered inside the `Menu` component. Typically, this would be a list of `Menu.Item` elements.
- **onClick** (`function`): Callback function that is called when a menu item is clicked. It receives the click event as an argument.

### Usage

The `SettingsNav` component wraps the Ant Design `Menu` component in a styled `Card`. The menu items are provided as children, and the `onClick` callback handles click events on these items.

### JSX Structure

```javascript
const SettingsNav = ({ children, onClick }) => {
    return (
        <Card hoverable style={{ borderRadius: "20px", padding: "0px" }}>
            <Menu
                mode="inline"
                style={{ borderRadius: "20px", border: "0px" }}
                selectable={false}
                onClick={(e) => onClick(e)}
            >
                {children}
            </Menu>
        </Card>
    );
};
```

### Example Usage

```javascript
import React from 'react';
import SettingsNav from './SettingsNav';
import { Menu } from 'antd';

const Example = () => {
    const handleMenuClick = (e) => {
        console.log('Clicked menu item:', e);
    };

    return (
        <SettingsNav onClick={handleMenuClick}>
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
            <Menu.Item key="3">Option 3</Menu.Item>
        </SettingsNav>
    );
};

export default Example;
```

## Styling

- **Card**: 
  - `borderRadius`: Set to `20px` for rounded corners.
  - `padding`: Set to `0px` to remove default padding.

- **Menu**:
  - `borderRadius`: Set to `20px` to match the card's rounded corners.
  - `border`: Set to `0px` to remove the border.

- **hoverable**: The `Card` component has the `hoverable` property to give it a hover effect.
