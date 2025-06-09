import { useContext } from "react";
import RegisterContext from "../context/RegisterContext";

const useRegisterFormContext = () => {
  return useContext(RegisterContext);
}

export default useRegisterFormContext