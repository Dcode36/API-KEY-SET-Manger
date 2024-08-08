import React, { useState } from 'react';

interface KeySetCardProps {
    keySet: {
        id: number;
        provider: string;
        model: string;
        apiKey: string;
        isDefault: boolean;
        lastSeen: string;
    };
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}

const KeySetCard: React.FC<KeySetCardProps> = ({ keySet, index, onEdit, onDelete, onSetDefault }) => {
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

    const toggleApiKeyVisibility = () => {
        setIsApiKeyVisible(!isApiKeyVisible);
    };
    const getTimeDifference = (timestamp: string): string => {
        const now = new Date();
        const lastSeen = new Date(timestamp);
        const diffInMs = now.getTime() - lastSeen.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes === 1) return '1 minute ago';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return '1 day ago';
        return `${diffInDays} days ago`;
    };

    return (

        <div className='card'>
            <div className='card-header'>
                <h3>API Key Set {index + 1} </h3>
                <button onClick={onEdit}><i className="bi bi-pencil-fill"></i>  Edit</button>
            </div>

            <div className='titles'>
                <p>Provider <br /> <span>{keySet.provider}</span></p>
            </div>
            <div className='titles'>
                <p>Model <br /> <span>{keySet.model}</span></p>
            </div>
            <div className='titles api'>
                <p>API Key <br /> <span>{isApiKeyVisible ? keySet.apiKey : keySet.apiKey.replace(/./g, '*')}</span></p>
                <button onClick={toggleApiKeyVisibility} className='eye'>
                    {isApiKeyVisible ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                </button>
            </div>
            <div className='titles'>
                <p>Last Used {getTimeDifference(keySet.lastSeen)}</p>
            </div>



            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className='titles'>
                    {keySet.isDefault ? (
                        <span className='default'>Default</span>
                    ) : (
                        <button onClick={onSetDefault} className='setDefault'>Set as Default</button>
                    )}
                </div>
                <button onClick={onDelete} className='delete' ><i className="bi bi-trash-fill"></i></button>
            </div>

        </div>
    );
};

export default KeySetCard;
