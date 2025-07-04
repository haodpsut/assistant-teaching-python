
import React from 'react';

export const PythonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
            <path d="M128 236v-80l-48-20-40 20" stroke="#306998"/>
            <path d="M128 20v80l48 20 40-20" stroke="#ffd43b"/>
            <path d="M40 76v104" stroke="#306998"/>
            <path d="M216 76v104" stroke="#ffd43b"/>
            <circle cx="88" cy="76" r="28" stroke="#306998" fill="#306998"/>
            <circle cx="168" cy="180" r="28" stroke="#ffd43b" fill="#ffd43b"/>
        </g>
    </svg>
);
