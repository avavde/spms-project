import React, { useState } from 'react';
import { CFormInput, CFormCheck } from '@coreui/react';

const SPCheckboxGroup = ({ options, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const newCheckedOptions = checkedOptions.includes(value)
      ? checkedOptions.filter((option) => option !== value)
      : [...checkedOptions, value];

    setCheckedOptions(newCheckedOptions);
    onChange(newCheckedOptions);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <CFormInput
        type="text"
        placeholder="Поиск"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        {filteredOptions.map((option) => (
          <CFormCheck
            key={option.value}
            id={option.value}
            value={option.value}
            label={option.label}
            checked={checkedOptions.includes(option.value)}
            onChange={handleCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};

export default SPCheckboxGroup;
