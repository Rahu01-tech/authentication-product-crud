import { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken , logoutUser , getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    function login(userData, token) {
        setUser(userData);
        setAccessToken(token);
    }

   async function logout() {
      try {
         await logoutUser();
       }  catch (error) {
          console.error("Logout error:", error.message);
       } finally {
         setUser(null);
        setAccessToken(null);
    }
}

    async function refreshToken() {
        try {
            const data = await refreshAccessToken();

            setAccessToken(data.accessToken);

            return data.accessToken;
        } catch (error) {
            setUser(null);
            setAccessToken(null);

            return null;
        }
    }

  useEffect(() => {
      async function restoreLogin() {
         const token = await refreshToken();

         if (token) {
               try {
                 const data = await getCurrentUser(token);
                 setUser(data.user);
              } catch (error) {
                 setUser(null);
                 setAccessToken(null);
               }
            }

         setLoading(false);
        }

       restoreLogin();
   }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                refreshToken,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}