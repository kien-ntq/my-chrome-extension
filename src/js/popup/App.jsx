import React, { useState, useEffect } from 'react';
import TabList from './TabList.jsx';
import { MessageTypes } from '../constants.js';

const App = ({ keys }) => {
    const [synchronizedTabIds, setSynchronizedTabIds] = useState([]);

    useEffect(() => {
        // Fetch initial synchronized group
        chrome.runtime.sendMessage({ type: MessageTypes.GET_SYNCHRONIZE_GROUP }, (response) => {
            if (response && response.payload.tabIds) {
                console.log('Initial synchronized group:', response.payload.tabIds);
                setSynchronizedTabIds(response.payload.tabIds);
            }
        });

        const messageListener = (message, sender, sendResponse) => {
            if (message.type === MessageTypes.SYNCHRONIZE_GROUP_UPDATED) {
                console.log('Received SYNCHRONIZE_GROUP_UPDATED:', message.payload);
                setSynchronizedTabIds(message.payload.tabIds || []);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return (
        <>
            <KeyboardShortcuts keys={keys} />
            <h1>Synchronized Tabs</h1>
            <TabList tabIds={synchronizedTabIds} />
        </>
    );
};

const KeyboardShortcuts = ({ keys }) => (
    <div>
        <h2>Keyboard Shortcuts</h2>
        <ul>
            {Object.entries(keys).map(([key, description]) => (
                <li key={key}>
                    <kbd>{key}</kbd> - {description}
                </li>
            ))}
        </ul>
    </div>
);

export default App;