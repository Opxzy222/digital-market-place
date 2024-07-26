import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// Component to render attribute inputs
const AttributeInputs = ({ attributes, handleAttributeChange }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const handleFeatureChange = (selectedOptions, attributeId) => {
    setSelectedFeatures(selectedOptions);
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    handleAttributeChange(attributeId, selectedValues);
  };

  const animatedComponents = makeAnimated();

  return (
    <div>
      {attributes.map(attribute => (
        <div className="form-group" key={attribute.id}>
          <label>{attribute.name}</label>

          {attribute.name.toLowerCase() === 'features' ? (
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={attribute.values.map(value => ({
                value: value.id,
                label: value.value,
              }))}
              value={selectedFeatures}
              onChange={selectedOptions => handleFeatureChange(selectedOptions, attribute.id)}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder='Select all that apply...'
            />
          ) : (
            <select
              className="form-control"
              onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
            >
              <option value="">Select {attribute.name}</option>
              {attribute.values.map(value => (
                <option key={value.id} value={value.id}>
                  {value.value}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttributeInputs;
