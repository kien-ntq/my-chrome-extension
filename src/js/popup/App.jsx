import React, { useState, useEffect } from 'react';
import TabList from './TabList.jsx';
import { MessageTypes } from '../constants.js';
import { Messenger } from '../Messenger.js';
import { ChromeAPI } from '../ChromeAPI.js';

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
    const [recentTabIds, setRecentTabIds] = useState([]);

    useEffect(() => {
        (async function () {
            const messenger = new Messenger(ChromeAPI);
            // Fetch initial synchronized group
            setSynchronizedTabIds(await messenger.getSynchronizeGroupFromBackground());
            setRecentTabIds(await messenger.getRecentTabsFromBackground());
        })()
        setupKeydownListener(Keys)

        return () => { };
    }, []);

    function switchToRecentTabsMode(ev) {
        setMode('Recent Tabs Mode');
    }

    return (
        <>
            <KeyboardShortcuts keys={Keys} />
            <h1 id='mode-indicator'>{mode}</h1>
            <TabList tabIds={mode == 'Recent Tabs Mode' ? recentTabIds : synchronizedTabIds} />
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