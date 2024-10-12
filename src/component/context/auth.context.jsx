import { useState, createContext } from "react";

export const AuthContext = createContext({
    user: { id: "", role: "" }, 
    setUser: () => {}            
});

export const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        id: "",
        role: ""
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {props.children}
        </AuthContext.Provider>
    );
};
