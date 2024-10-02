import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext({
    id: "",
    role: ""
});

export const AuthWrapper = (props) => {
    const [user, setUser] = useState(
        {
            id: "",
            role: ""
        }
    )
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}