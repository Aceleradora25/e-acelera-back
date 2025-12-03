import React from "react";
import { BasePropertyProps } from "adminjs";
import ReactQuill from "react-quill";


const MarkdownField: React.FC<BasePropertyProps> = ({ property, record, onChange }) => {
  // const value = record?.params?.[property.name] || '';
  const [value, setValue] = React.useState("");
  const initialValue = (record && record.params && record.params[property.name]) || "";

  if(typeof window === "undefined"){
    return <div>
        carregando...
      </div>
  }

  React.useEffect(()=>{
    setValue(initialValue)
  }, [initialValue]);
  
  
  const handleChange = (content: string) => {
    if (onChange) {
      setValue(content);
      onChange(property.name,content);

    }

    // setTest(event.target.value)
  };

  return (
    <>
      <label htmlFor="">
        {property.name}
      </label>
      {/* <textarea
      value={value}
      onChange={handleChange}
      style={{ width: '100%', minHeight: '150px', padding: '8px' }}
      /> */}
      <ReactQuill value={value} onChange={handleChange} id="react-quill"/>
    </>
  );
};

export default MarkdownField;
