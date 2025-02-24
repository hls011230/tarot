import { useEffect } from "react";
import { getLocalStorageToken } from "../components/Token";
import { useRouter } from "next/router";


const withAuth = (WrappedComponent) => {

    return function WithAuth(props) {
        const router = useRouter();

        const token = getLocalStorageToken('id');

        useEffect(() => {
            if (token === undefined) {
                router.replace('/?login=false');
            }
        }, [token,router]);

        return <WrappedComponent {...props} />;
    };
}

export default withAuth;