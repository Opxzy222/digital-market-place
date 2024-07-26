import React, { useState } from 'react';

const CustomDropdown = ({ attribute, handleAttributeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="custom-dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {attribute.name}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {attribute.values.map(value => (
            <div key={value.id} className="dropdown-item">
              <input
                type="checkbox"
                id={`attribute_${attribute.id}_value_${value.id}`}
                name={`attribute_${attribute.id}`}
                value={value.id}
                onChange={(e) => handleAttributeChange(attribute.id, value.id, e.target.checked)}
              />
              <label htmlFor={`attribute_${attribute.id}_value_${value.id}`}>{value.value}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
