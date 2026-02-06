import React, { useState, useEffect } from 'react';
import TabList from './TabList.jsx';
import { MessageTypes } from '../constants.js';

const App = () => {
    const Keys = {
        's': {
            description: "Toggle Scroll Sync",
            func: toggleScrollSyncForCurrentTab,
        },
        't': {
            description: "Recent Tabs",
            func: switchToRecentTabsMode,
        },
    };

    const [mode, setMode] = useState('Synchronized Tabs');
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
        setupKeydownListener(Keys)

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    function switchToRecentTabsMode(ev) {
        setMode('Recent Tabs Mode');
    }

    return (
        <>
            <KeyboardShortcuts keys={Keys} />
            <h1 id='mode-indicator'>{mode}</h1>
            <TabList mode={mode} tabIds={synchronizedTabIds} />
        </>
    );
};

const KeyboardShortcuts = ({ keys }) => (
    <div>
        <h2>Keyboard Shortcuts</h2>
        <ul>
            {Object.entries(keys).map(([key, data]) => (
                <li key={key}>
                    <kbd>{key}</kbd> - {data.description}
                </li>
            ))}
        </ul>
    </div>
);

function toggleScrollSyncForCurrentTab(ev) {
    throw new Error('Function not implemented.');
}

async function setupKeydownListener(Keys) {
    document.addEventListener('keydown', async (ev) => {
        if (ev.key in Keys) {
            Keys[ev.key].func()
            ev.preventDefault() // Prevent the default action of the key
        }
    });
}

export default App;