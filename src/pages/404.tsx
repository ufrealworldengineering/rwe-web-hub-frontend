import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
            <>Page not found.</>
            <Link
                className="underline"
                to='/'
                rel='noopener noreferrer'
            >
                Home
            </Link>
        </div>
    );
}

export default NotFound;