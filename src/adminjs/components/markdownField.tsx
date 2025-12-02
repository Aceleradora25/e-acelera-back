import React from "react";
import { BasePropertyProps } from "adminjs";

const MarkdownField: React.FC<BasePropertyProps> = ({ property, record, onChange }) => {
  const value = record?.params?.[property.name] || '';

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(property.name, event.target.value);
    }
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      style={{ width: '100%', minHeight: '150px', padding: '8px' }}
    />
  );
};

export default MarkdownField;
