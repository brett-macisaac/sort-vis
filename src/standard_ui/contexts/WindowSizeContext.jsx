import React, { createContext, useContext, useState, useEffect } from 'react';
import utils from '../utils';


const WindowSizeContext = createContext();


function WindowSizeProvider({ children }) 
{
    /* The dimensions/size of the window. */
    const [ stWindowSize, setWindowSize ] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Whether the screen is landscape (false if it's a square).
    const isLandscape = stWindowSize.width > stWindowSize.height;

    /**
    * Updates stWindowSize.
    */
    const updateWindowSize = () =>
    {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    /*
    * Setup the event listener to update stWindowSize whenever the window size changes.
    */
    useEffect(
        () =>
        {
            // Set-up an event-listener for window resize.
            window.addEventListener('resize', utils.debounce(updateWindowSize, 200));

            return () =>
            {
                // Remove event listener.
                window.removeEventListener('resize', utils.debounce(updateWindowSize, 200));
            }
        },
        []
    );

    return (
        <WindowSizeContext.Provider 
            value = {{ 
                windowSize: stWindowSize, isLandscape
            }}
        >
            { children }
        </WindowSizeContext.Provider>
    );
}

function useWindowSize() 
{
    return useContext(WindowSizeContext);
}


export { WindowSizeProvider as default, useWindowSize };