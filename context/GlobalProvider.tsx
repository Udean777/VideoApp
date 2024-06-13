import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appWrite";

const GlobalContext = createContext<any>({});

export const useGlobalContext = () => useContext(GlobalContext);

type GlobalProviderProps = {
    children: ReactNode;
};

const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getCurrentUser()
            .then((res: any) => {
                if (res) {
                    setIsLoggedIn(true)
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(null)
                }
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }, [])

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
