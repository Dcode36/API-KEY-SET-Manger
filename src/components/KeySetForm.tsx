import React, { useState, useEffect } from 'react';

interface KeySetFormProps {
    keySet: {
        id: number;
        provider: string;
        model: string;
        apiKey: string;
        isDefault: boolean;
    };
    onSave: (keySet: any) => void;
}

const KeySetForm: React.FC<KeySetFormProps> = ({ keySet, onSave }) => {
    const [provider, setProvider] = useState(keySet.provider);
    const [model, setModel] = useState(keySet.model);
    const [apiKey, setApiKey] = useState(keySet.apiKey);

    useEffect(() => {
        setProvider(keySet.provider);
        setModel(keySet.model);
        setApiKey(keySet.apiKey);
    }, [keySet]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newKeySet = { ...keySet, provider, model, apiKey };
        let keySets = JSON.parse(localStorage.getItem('keySets') || '[]');

        // Update existing key set or add new key set
        if (keySets.some((ks: any) => ks.id === keySet.id)) {
            keySets = keySets.map((ks: any) => (ks.id === keySet.id ? newKeySet : ks));
        } else {
            keySets.push(newKeySet);
        }

        localStorage.setItem('keySets', JSON.stringify(keySets));
        onSave(newKeySet); // This will update the parent state as well
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="" style={{ fontWeight: "bold" }}>Provider:</label>
            <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="Open AI"
            />
            <label htmlFor="" style={{ fontWeight: "bold" }}>Model:</label>
            <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="ChatGPT v.2"
            />
            <label htmlFor="" style={{ fontWeight: "bold" }}>API Key:</label>
            <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="YOUR API KEY"
            />
            <button type="submit" className='submit'>Save</button>
        </form>
    );
};

export default KeySetForm;
