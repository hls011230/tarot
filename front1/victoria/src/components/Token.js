import Cookies from 'js-cookie';
import { useEffect ,createContext, useState } from "react";
import axios from 'axios';

export const TokenContext = createContext();
export const getLocalStorageToken = (key) => {
  return Cookies.get(key)
};

export const removeLocalStorageToken = (key) => {
  return Cookies.remove(key)
}

export function TokenProvider({ children }) {
    const [user,setUser] = useState(null);

    const getUser = async() => {
      try {
        const {data} = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/get-user/'+ getLocalStorageToken('id'));
        setUser(data.data);
        
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    useEffect(() => {

      if (getLocalStorageToken('id') !== undefined) {
        if (user == null) {
          getUser();
        }
      }

    }, []);


    const login = async ({ user }) => {
        try {           
            Cookies.set('id', user.id);
            setUser(user);
        }catch (error) {
            console.log(error);
        }
    }

    const refreshUser = async () => {
      try {           
          getUser();
      }catch (error) {
          console.log(error);
      }
  }

    const logout = async () => {
        setUser(null);
        try {
            Cookies.remove('id');
        }catch (error) {
            console.log(error);
        }
    }


  return (
    <TokenContext.Provider value={{ user , login , logout , refreshUser }}>
      {children}
    </TokenContext.Provider>
  );
}