import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-16 py-8 border-t border-gray-200">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <span>Made with</span>
                    <span className="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.312 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </span>
                    <span>by</span>
                    <a
                        href="https://trytechit.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 font-semibold hover:text-indigo-600 transition-colors"
                    >
                        TechIt
                    </a>
                </div>
                <div className="text-xs text-gray-400">
                    © {new Date().getFullYear()} TechIt. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
