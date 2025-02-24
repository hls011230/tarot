import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { TokenContext } from '@/components/Token';
const Login =  ({user}) => {
    const router = useRouter();
    const { login } = useContext(TokenContext);


    const handleLogin = async()=> {
        try {
            const { data } = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/login', {
                username: user.username,
                password: user.password
            });

            login({user:data.data});
            router.replace("/?login=true");

        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    return (
        <Button onClick = {handleLogin} >登录</Button>
    )
}

export default Login;