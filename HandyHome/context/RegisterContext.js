import { createContext, useState, useEffect } from "react";

const RegisterContext = createContext({})

export const RegisterProvider = ({children}) => {
    const [registerForm, setRegisterForm] = useState({
        firsName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        email: '',
        phoneNumber: '',
        password: '',
        block: '',
        province: '',
        municipal: '',
        barangay: ''
    })
    
    const updateRegisterForm = (name, data) => {
        setRegisterForm((prev) = {
            ...prev,
            [name]: data
        })
    }

    return (
        <RegisterContext.Provider value={{registerForm, updateRegisterForm}}>
            {children}
        </RegisterContext.Provider>
    )
}

export default RegisterContext;