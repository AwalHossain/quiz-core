import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-auto">
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                    © {currentYear} All rights reserved by Awal Hossain
                </p>
            </div>
        </footer>
    );
};

export default Footer;
