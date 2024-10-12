// Define the shape of the context's value for Context API of react
interface DemoContextProps {
  value: string;
  updateValue: (newValue: string) => void;
}

// this is the simplified version of the context. here is 2 vales and 2 placeholder functions, can add more if needed
interface DemoContextProps {
  value1: string;
  value2: string;
  updateValue1: (newValue: string) => void;
  updateValue2: (newValue: string) => void;
}
