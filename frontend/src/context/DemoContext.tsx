import React, { createContext, useContext, useState } from "react";

// this is the simplified version of the context. here is 2 vales and 2 placeholder functions, can add more if needed
const DemoContext = createContext<DemoContextProps>({
  value1: "", // Default value
  value2: "", // Default value
  updateValue1: () => {}, // Placeholder function
  updateValue2: () => {}, // Placeholder function
});

// Create a provider component
export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState<string>(""); // Default value

  const updateValue = (newValue: string) => {
    setValue(newValue);
  };

  return <DemoContext.Provider value={{ value, updateValue }}>{children}</DemoContext.Provider>;
};

// Create a custom hook for easier access to the context
export const useDemo = () => {
  return useContext(DemoContext);
};
// Example of how to use the DemoContext in another component

// import React from "react";
// import { useDemo } from "./DemoContext";

// const DemoComponent = () => {
//   const { value, updateValue } = useDemo();

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     updateValue(event.target.value);
//   };

//   return (
//     <div>
//       <input type="text" value={value} onChange={handleChange} />
//       <p>Current Value: {value}</p>
//     </div>
//   );
// };

// export default DemoComponent;
