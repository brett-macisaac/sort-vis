import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import _debounce from "lodash/debounce";

import SortView from './SortView.jsx';

import { ranges, sortAlgoNames, sortAlgos } from './sort_resources.js';

import { utils } from '../../standard_ui/standard_ui';

import Elements, { SortAction } from "./Elements.js"

function Sort({}) 
{
    const [ stIndexSelectedSortAlgo, setIndexSelectedSortAlgo ] = useState(4);

    const [ stNumElements, setNumElements ] = useState(gDefaultNumElements);

    const [ stIsAscending, setIsAscending ] = useState(true);

    const rfIsVolumeOn = useRef(false);

    // The speed (i.e. the number of milliseconds of each pause; the lower this value, the faster the sorting).
    // const [ stSpeed, setSpeed ] = useState(100);

    // This is used to update the view, rather than using state variables for the elements.
    const [ stUpdater, setUpdater ] = useState({});

    /* A reference to the button that stops the sorting process. */
    const rfBtnStop = useRef(undefined);

    /* A reference to the 'skip next' button. */
    const rfBtnSkipNext = useRef(undefined);

    /* A reference to the 'skip prev' button. */
    const rfBtnSkipPrev = useRef(undefined);

    /* A reference to the 'play/pause' button. */
    const rfBtnPlayPause = useRef(undefined);

    /* A ref to the speed. */
    const rfSpeed = useRef(11);

    /* A ref for the current direction of the sort: true = forward; false = backwards. */
    const rfDirection = useRef(true);

    const rfIsPaused = useRef(false);

    const rfStopProcess = useRef(false);

    const rfIsSorting = useRef(false);

    const rfReRender = useRef(
        () =>
        {
            setUpdater({});
        }
    );

    const rfElements = useRef(
        new Elements(
            gDefaultNumElements
        )
    );

    useEffect(
        () =>
        {
            updateNumElements(stNumElements);
        },
        [ stNumElements ]
    );

    const handleBtnPlayPause = useCallback(
        async (pSorting = true) =>
        {
            if (!(rfIsSorting.current))
            {
                console.log("Start sort");

                rfIsSorting.current = true;
                rfIsPaused.current = false;
                rfStopProcess.current = false;
                rfDirection.current = true;

                // rfElements.current.reset();
            }
            else if (!(rfIsPaused.current))
            {
                rfIsPaused.current = true;
                rfReRender.current();
                console.log(rfIsPaused.current ? "Pause" : "Resume");
                return;
            }
            else
            {
                return;
            }

            rfReRender.current();

            // Populate the sort actions (if in 'sorting mode').
            if (pSorting)
            {
                rfElements.current.reset();
                await sortAlgos[sortAlgoNames[stIndexSelectedSortAlgo]](rfElements.current, stIsAscending);
            }
            // await sortAlgos[sortAlgoNames[stIndexSelectedSortAlgo]](rfElements, stIsAscending);

            // To have forward/reverse, will need to have the loop at this level, instead of using Elements' applySortActions.
            // Apply the sort actions.
            // await rfElements.current.applySortActions();

            let lSortActions = rfElements.current.sortActions;
            let lLengthSortActions = rfElements.current.lengthSortActions;
            console.log(lSortActions);
            console.log(lLengthSortActions);

            let lSkipPrev = false;

            let lPassedFirstActionReverse = false;
            let lPassedFirstActionForward = false;

            // The indexes of the previous two actions.
            let lIndexPrevAction = -1;
            let lIndexPrevActionM1 = -1;

            // The value of rfDirection.current at the last applied action.
            let lDirectionLastAction = true;

            for (let i = 0; i < lLengthSortActions; )
            {
                // Apply corrective measures if necessary.
                // The user can change direction at any moment, so must account for potential failures.
                if (lIndexPrevAction == i && lIndexPrevActionM1 == i)
                {
                    if (rfDirection.current)
                    {
                        ++i;
                    }
                    else if (i == 0)
                    {
                        ++i;
                        rfDirection.current = true;
                    }
                    else
                    {
                        --i;
                    }
                    // console.log("Correction 1");
                }
                else if (lDirectionLastAction != rfDirection.current && i != lIndexPrevAction)
                {
                    i = lIndexPrevAction;
                    // console.log("Correction 2");
                }

                lDirectionLastAction = rfDirection.current;

                // Implement the colour-changing again. Modify the elements to contain a number and a colour, or perhaps
                // a character indicating which state it's in e.g. normal, compared, swapped, etc.

                // Apply action.
                rfElements.current.applySortAction(lSortActions[i]);
                rfReRender.current();

                // Set frequency of note.
                if (rfIsVolumeOn.current)
                {
                    let lFreq = lFreqBase;

                    if (lSortActions[i].type == SortAction.Type.Set)
                    {
                        let lIndexNormalised = Math.floor(100 * (lSortActions[i].valueA / rfElements.current.length));

                        let lValAvg = (lSortActions[i].valueB + lIndexNormalised) / 2;

                        lFreq += lValAvg * 3;
                    }
                    else
                    {
                        let lIndexNormalisedA = Math.floor(100 * (lSortActions[i].valueA / rfElements.current.length));
                        let lIndexNormalisedB = Math.floor(100 * (lSortActions[i].valueB / rfElements.current.length));

                        let lValAvg = (lIndexNormalisedA + lIndexNormalisedB) / 2;

                        lFreq += lValAvg * 3;
                    }

                    // Play the note.
                    playNote(lFreq);
                }

                lIndexPrevActionM1 = lIndexPrevAction;
                lIndexPrevAction = i;

                // Pause or skip.
                lSkipPrev = await sleepOrSkip();

                // Remove any colours.
                if (lSortActions[i].type == SortAction.Type.Set)
                {
                    rfElements.current.resetElementColour(lSortActions[i].valueA);
                }
                else
                {
                    rfElements.current.resetElementColour(lSortActions[i].valueA);
                    rfElements.current.resetElementColour(lSortActions[i].valueB);
                }

                // await Promise.all([lSound.play(), sleepOrSkip()]);

                if (rfStopProcess.current)
                    break;

                // There should be an icon which indicates if the sort is running in reverse.
                // Maybe an icon which displays for a fraction of a second. icon shouldn't obscure it too much, maybe a 
                // large translucent arrow.

                // Must go forward if at 0.
                if (i == 0)
                {
                    if (rfDirection.current == false)
                    {
                        rfDirection.current = true;
                        lSkipPrev = false;
                        lPassedFirstActionReverse = false;
                        lPassedFirstActionForward = false;
                    }
                    else
                    {
                        lPassedFirstActionForward = true;
                    }
                }

                if (rfDirection.current && !lSkipPrev)
                {
                    if (!lPassedFirstActionForward)
                    {
                        lPassedFirstActionForward = true;
                    }
                    else
                    {
                        ++i;
                    }

                    if (lPassedFirstActionReverse)
                        lPassedFirstActionReverse = false;
                }
                else
                {
                    if (!lPassedFirstActionReverse)
                    {
                        lPassedFirstActionReverse = true;
                    }
                    else
                    {
                        --i;
                    }

                    if (lPassedFirstActionForward)
                        lPassedFirstActionForward = false;
                }
            }

            rfIsSorting.current = false;

            rfReRender.current();

            console.log("End sort");
        },
        [ stIndexSelectedSortAlgo, stIsAscending ]
    );

    const sleepOrSkip = useCallback(
        async () =>
        {
            if (rfIsPaused.current)
            {
                console.log("Pause until clicks");

                // Need a way of determining which one was clicked. It shouldn't be unpaused if _btnSkip was the click
                const lIndexClick = await utils.sleepUntilClicks([ rfBtnSkipNext.current, rfBtnSkipPrev.current,
                                                                   rfBtnPlayPause.current, rfBtnStop.current ]);

                console.log(lIndexClick);

                if (lIndexClick != 0 && lIndexClick != 1)
                {
                    rfIsPaused.current = false;
                }

                rfReRender.current();

                // Return whether the 'skip prev' button was clicked.
                return lIndexClick == 1;
            }
            else
            {
                await utils.sleepFor(rfSpeed.current);
                return false;
            }
        },
        []
    );

    const handleBtnSortDir = useCallback(
        async () =>
        {
            setIsAscending((prev) => { return !prev });
        },
        []
    );

    const handleBtnVolume = useCallback(
        async () =>
        {
            rfIsVolumeOn.current = !rfIsVolumeOn.current;

            rfReRender.current();
        },
        []
    );

    const handleChangeDirection = useCallback(
        async () =>
        {
            console.log("Change direction.")
            rfDirection.current = !rfDirection.current;
        },
        []
    );

    const handleBtnShuffle = useCallback(
        async () =>
        {
            rfElements.current.reset();

            await rfElements.current.shuffleSnapshot();

            await handleBtnPlayPause(false);
        },
        [ handleBtnPlayPause ]
    );

    const handleBtnStop = useCallback(
        () =>
        {
            rfStopProcess.current = true;
        },
        []
    );

    const handleChangeSliderSpeed = useCallback(
        (pSpeed) =>
        {
            rfSpeed.current = ranges.speed.max - pSpeed + 1;

            rfReRender.current();
        },
        [] // stSpeed
    );

    const updateNumElements = useMemo(
        () =>
        {
            return _debounce(
                async (pNumElements) =>
                {
                    console.log("Updating number of elements.");

                    rfElements.current.resize(pNumElements);

                    rfReRender.current();
                },
                750
            )
        }, 
        []
    );

    return (
        <SortView
            prElements = { rfElements.current.elements }
            prNumElements = { stNumElements }
            prIndexSelectedSortAlgo = { stIndexSelectedSortAlgo }
            prSpeed = { rfSpeed.current }
            prOnPlayPause = { handleBtnPlayPause }
            prOnChangeSliderSpeed = { handleChangeSliderSpeed }
            prOnChangeSliderNumEls = { setNumElements }
            prOnPressBtnSortDir = { handleBtnSortDir }
            prOnPressCmbSortAlgo = { setIndexSelectedSortAlgo }
            prOnPressBtnShuffle = { handleBtnShuffle }
            prOnPressBtnStop = { handleBtnStop }
            prOnPressBtnVolume = { handleBtnVolume }
            prOnPressChangeDirection = { handleChangeDirection }
            prUpdater = { stUpdater }
            prRefBtnStop = { rfBtnStop }
            prRefBtnSkipNext = { rfBtnSkipNext }
            prRefBtnSkipPrev = { rfBtnSkipPrev }
            prRefBtnPlayPause = { rfBtnPlayPause }
            prIsSorting = { rfIsSorting.current }
            prIsPaused = { rfIsPaused.current }
            prIsAscending = { stIsAscending }
            prIsVolumeOn = { rfIsVolumeOn.current }
        />
    )
}

// The initial number of elements.
const gDefaultNumElements = 40

// The global audio-context.
let gAudioContext = null;

// The base frequency of the sound effects.
const lFreqBase = 150;

/**
* Plays a note at a given frequency.

* Parameters:
    @param {number} pFreq The frequency at which to play the given note.
*/
function playNote(pFreq)
{
    // Create the context if it's not already created,
    if (gAudioContext == null)
    {
        gAudioContext = new AudioContext();
        // gAudioContext = new (AudioContext || window.webkitAudioContext)();
    }

    // The 'low' volume and the 'high' volume.
    const lVolumeLow = 0.000001;
    const lVolumeHigh = 0.15

    // The time it takes to go from the low volume to the high volume and vice-versa.
    const lTimeToHigh = 0.4;
    const lTimeToLow = 0.4;

    // The oscillator used to create the tone.
    const lOsc = gAudioContext.createOscillator();

    // Set the oscillator's frequency.
    lOsc.frequency.value = pFreq;

    // Set a gain node.
    const node = gAudioContext.createGain();
    node.connect(gAudioContext.destination);
    lOsc.connect(node);

    // Start Low
    node.gain.setValueAtTime(lVolumeLow, gAudioContext.currentTime); 

    // Low to high.
    node.gain.exponentialRampToValueAtTime(
        lVolumeHigh, gAudioContext.currentTime + lTimeToHigh
    );

    node.gain.setValueAtTime(lVolumeHigh, gAudioContext.currentTime + lTimeToHigh); 

    // High to low.
    node.gain.exponentialRampToValueAtTime(
        lVolumeLow, gAudioContext.currentTime + lTimeToHigh + lTimeToLow
    );

    lOsc.start(gAudioContext.currentTime);

    lOsc.stop(gAudioContext.currentTime + lTimeToHigh + lTimeToLow + 0.01);
}

export default Sort;