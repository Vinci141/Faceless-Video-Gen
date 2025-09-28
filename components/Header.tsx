
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-3xl font-bold text-white text-center tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
                        AI Faceless Video Creator
                    </span>
                </h1>
                <p className="text-center text-gray-400 mt-1">Transform Text into YouTube Gold</p>
            </div>
        </header>
    );
};
