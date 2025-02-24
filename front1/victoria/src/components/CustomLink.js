import { useRouter } from "next/router";
import { useEffect } from "react";

const CustomLink = ({ href, children,prefetch = false, replace = false , shallow= false,activeClassName='active', ...props }) => {
    const router = useRouter();
    const isActive = router.pathname === href;

    useEffect(()=>{
        if(prefetch) {
            router.prefetch(href)
        }
    },[router,href,prefetch])

    const handleClick = (e) => {
        e.preventDefault();
        if (replace) {
            router.replace(href, undefined, { shallow });
        } else {
            router.push(href, undefined, { shallow });
        }
    }

    return (
        <a href={href} onClick={handleClick} className={`${props.className}${isActive ? `${activeClassName}` : ''}`} {...props}>
            {children}
        </a>
    )
}

export default CustomLink;