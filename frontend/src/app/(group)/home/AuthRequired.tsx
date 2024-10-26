'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const AuthRequired = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const authRequired = searchParams.get('authRequired');
        if (authRequired === 'true') {
            toast.error('You need to log in to access that page.');
            // Optionally, you can clear the query parameter here
            // This prevents the toast from showing again on page refresh
            window.history.replaceState({}, '', '/home');
        }
    }, [searchParams]);

    return null;
};

export default AuthRequired;
