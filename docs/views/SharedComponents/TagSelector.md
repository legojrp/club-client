# `TagSelector` Component

The `TagSelector` component is a multi-select dropdown used for selecting and deselecting tags from a predefined list. It is built using the Ant Design `Select` component and allows users to choose multiple tags that are relevant to their needs.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products.

## Component Structure

### Imports

```javascript
import React, { Fragment } from 'react';
import { Select } from 'antd';
```

### Props

- **handleSelect** (`function`): Callback function to handle when a tag is selected.
- **handleDeselect** (`function`): Callback function to handle when a tag is deselected.
- **defaultValue** (`array`): Default selected tags when the component is first rendered.
- **value** (`array`): Currently selected tags.
- **className** (`string`): Optional CSS class to apply to the `Select` component.
- **placeholder** (`string`): Placeholder text to display when no tags are selected.

### Usage

The `TagSelector` component provides a dropdown list with various tags. Users can select or deselect tags, and the component will update the selected tags accordingly.

### JSX Structure

```javascript
const TagSelector = ({ handleSelect, handleDeselect, defaultValue, value, className, placeholder }) => {
    return (
        <Select
            className={className || null}
            value={value}
            mode="multiple"
            style={{ width: '100%', margin: '10px 0px', border: 'none' }}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onSelect={(e) => handleSelect(e)}
            onDeselect={(e) => handleDeselect(e)}
        >
            <Option key="Academics">Academics</Option>
            <Option key="Art">Art</Option>
            <Option key="Athletics">Athletics</Option>
            <Option key="Awareness">Awareness</Option>
            <Option key="Business">Business</Option>
            <Option key="Competition">Competition</Option>
            <Option key="Cultural">Cultural</Option>
            <Option key="Cooking">Cooking</Option>
            <Option key="Diversity">Diversity</Option>
            <Option key="Gaming">Gaming</Option>
            <Option key="Medicine">Medicine</Option>
            <Option key="Mentorship">Mentorship</Option>
            <Option key="Politics">Politics</Option>
            <Option key="Programming">Programming</Option>
            <Option key="Recreation">Recreation</Option>
            <Option key="Religion">Religion</Option>
            <Option key="Science">Science</Option>
            <Option key="Service">Service</Option>
            <Option key="Sports">Sports</Option>
            <Option key="Theater">Theater</Option>
            <Option key="Technology">Technology</Option>
            <Option key="Volunteering">Volunteering</Option>
        </Select>
    );
};
```

## Example Usage

```javascript
import React, { useState } from 'react';
import TagSelector from './TagSelector';

const Example = () => {
    const [selectedTags, setSelectedTags] = useState([]);

    const handleSelect = (tag) => {
        setSelectedTags([...selectedTags, tag]);
    };

    const handleDeselect = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    return (
        <TagSelector
            value={selectedTags}
            handleSelect={handleSelect}
            handleDeselect={handleDeselect}
            placeholder="Select tags"
        />
    );
};

export default Example;
```

## Styling

- **width**: Set to `100%` to occupy the full width of the container.
- **margin**: Applies a margin of `10px 0px` for spacing.
- **border**: Set to `none` to remove the default border styling