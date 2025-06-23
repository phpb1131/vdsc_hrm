'use client';

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = 'Đang tải...',
    centered = true
}) => {
    const sizeClass = {
        sm: 'spinner-border-sm',
        md: '',
        lg: 'spinner-border-lg'
    }[size];

    const content = (
        <div className="d-flex align-items-center">
            <div className={`spinner-border text-primary ${sizeClass}`} role="status">
                <span className="visually-hidden">{text}</span>
            </div>
            {text && <span className="ms-2">{text}</span>}
        </div>
    );

    if (centered) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
