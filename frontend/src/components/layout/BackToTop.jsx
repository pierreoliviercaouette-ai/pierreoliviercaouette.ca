import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-dark text-white shadow-lg hover:bg-primary transition-colors z-50 animate-fade-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Retour en haut de la page"
            data-testid="back-to-top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
};
