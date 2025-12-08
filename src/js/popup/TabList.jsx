import React, { useState, useEffect } from 'react';

/**
 * A component that fetches and displays information about a list of tabs.
 * @param {{tabIds: number[]}} props - The props object.
 * @param {number[]} props.tabIds - An array of tab IDs to display.
 */
const TabList = ({ tabIds }) => {
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        if (!tabIds || tabIds.length === 0) {
            setTabs([]);
            return;
        }

        const fetchTabs = async () => {
            // Fetch each tab by its ID using chrome.tabs.get (which only accepts a single tab ID)
            //const tabObjects = await chrome.tabs.query({ tabId: tabIds }); // need tabs permission
            const results = await Promise.allSettled(tabIds.map(id => chrome.tabs.get(id)));
            const tabObjects = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);
            setTabs(tabObjects);
        };

        fetchTabs().catch(console.error);
    }, [tabIds]); // Re-run the effect if the tabIds prop changes

    return (
        <ul>
            {tabs.map(tab => (
                <li key={tab.id} title={tab.url}>
                    <img src={tab.favIconUrl} alt="" width="16" height="16" /> {tab.title}
                </li>
            ))}
        </ul>
    );
};

export default TabList;
