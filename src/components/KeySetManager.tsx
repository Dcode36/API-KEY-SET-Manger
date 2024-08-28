import React, { useState, useEffect } from 'react';
import KeySetCard from './KeySetCard';
import KeySetForm from './KeySetForm';
import Modal from 'react-modal'
import '../App.css';

interface KeySet {
    id: number;
    provider: string;
    model: string;
    apiKey: string;
    isDefault: boolean;
    lastSeen: string;
}

const KeySetManager: React.FC = () => {
    const [keySets, setKeySets] = useState<KeySet[]>([]);
    const [editingKeySet, setEditingKeySet] = useState<KeySet | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load key sets from local storage on mount
    useEffect(() => {
        const storedKeySets = localStorage.getItem('keySets');
        if (storedKeySets) {
            setKeySets(JSON.parse(storedKeySets));
        }
    }, []);

    // Save key sets to local storage whenever keySets state changes
    useEffect(() => {
        localStorage.setItem('keySets', JSON.stringify(keySets));
    }, [keySets]);

    const addKeySet = (newKeySet: KeySet) => {
        newKeySet.lastSeen = new Date().toLocaleString();
        setKeySets([...keySets, newKeySet]);
    };

    const updateKeySet = (updatedKeySet: KeySet) => {
        updatedKeySet.lastSeen = new Date().toLocaleString();
        setKeySets(keySets.map(ks => (ks.id === updatedKeySet.id ? updatedKeySet : ks)));
    };

    const deleteKeySet = (id: number) => {
        setKeySets(keySets.filter(ks => ks.id !== id));
    };

    const setDefaultKeySet = (id: number) => {
        setKeySets(keySets.map(ks => ({
            ...ks,
            isDefault: ks.id === id,
            lastSeen: ks.id === id ? new Date().toLocaleString() : ks.lastSeen,
        })));
    };

    const closeModal = () => {
        setEditingKeySet(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className='header'>
                <h3>My Keys are here</h3>
                <button
                    onClick={() => {
                        setEditingKeySet({
                            id: Date.now(),
                            provider: '',
                            model: '',
                            apiKey: '',
                            isDefault: false,
                            lastSeen: new Date().toLocaleString(),
                        });
                        setIsAddingNew(true);
                        setIsModalOpen(true);
                    }}
                >
                    Add New Key
                </button>
            </div>

            {keySets.length === 0 && <p style={{ margin: "20px" }}>No API key sets available.</p>}
            <div className='api-key-container'>


                {keySets.map((ks, index) => (
                    <KeySetCard
                        index={index}
                        key={ks.id}
                        keySet={ks}
                        onEdit={() => {
                            setEditingKeySet(ks);
                            setIsAddingNew(false);
                            ks.lastSeen = new Date().toLocaleString();
                            updateKeySet(ks);
                            setIsModalOpen(true);
                        }}
                        onDelete={() => deleteKeySet(ks.id)}
                        onSetDefault={() => setDefaultKeySet(ks.id)}
                    />
                ))}
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit API Key"
                ariaHideApp={false}
                className="modal"
                overlayClassName="modal-overlay"
            >
                {editingKeySet && (
                    <KeySetForm
                        keySet={editingKeySet}
                        onSave={(keySet: KeySet) => {
                            if (isAddingNew) {
                                addKeySet(keySet);
                            } else {
                                updateKeySet(keySet);
                            }
                            closeModal();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default KeySetManager;
