import { createContext, useContext } from "react";
import { useState } from "react";
import MyAlert from "../Components/MyAlert";

export const AlertContext = createContext({});
export const AlertProvider = ({ children }) => {
    let [openAlert, setOpenAlert] = useState(false);
let [textAlert, setTextAlert] = useState("");
let [colorAlert,setColorAlert]=useState('success')
const handelOpenAlert = () => {
  setOpenAlert(true);
  setTimeout(() => {
    setOpenAlert(false);
  }, 3000);
};
  return (
    <AlertContext.Provider value={{ handelOpenAlert, setTextAlert , setColorAlert}}>
      <MyAlert open={openAlert} text={textAlert} color={colorAlert}/>
      {children}
    </AlertContext.Provider>
  );
};
export const useAlert =()=>{
    return useContext(AlertContext)
}