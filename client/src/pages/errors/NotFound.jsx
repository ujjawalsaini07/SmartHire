import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="page-shell flex min-h-screen items-center justify-center p-4">
            <div className="card max-w-xl p-10 text-center">
                <h1 className="mb-3 text-7xl font-bold gradient-text">404</h1>
                <h2 className="mb-4 text-2xl font-bold text-light-text dark:text-dark-text">Page Not Found</h2>
                <p className="mx-auto mb-8 max-w-md text-light-text-secondary dark:text-dark-text-secondary">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
        </div>
    );
};

export default NotFound;
