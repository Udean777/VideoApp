import { getCurrentUser } from "@/libs/appWrite";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

const GlobalContext = createContext<any>({});

export const useGlobalContext = () => useContext(GlobalContext);

type GlobalProviderProps = {
    children: ReactNode;
};

const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [followState, setFollowState] = useState({})

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

    const updateFollowState = (userId: string, isFollowing: boolean) => {
        setFollowState((prevState) => ({
            ...prevState,
            [userId]: isFollowing
        }))
    }

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
            followState,
            updateFollowState
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
