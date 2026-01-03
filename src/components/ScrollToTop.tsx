import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component - scrolls to top on route change
 * Placed inside BrowserRouter to access useLocation hook
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top immediately on route change
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
