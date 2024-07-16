import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { globalStyles } from '../../styles';
import themes, { defaultTheme } from '../../themes/themes.js';

import { ButtonStd } from "../../standard_ui/standard_ui";
import { PageContainerStd } from "../../standard_ui/standard_ui";
import { useTheme } from "../../standard_ui/standard_ui";
import { useWindowSize } from '../../standard_ui/standard_ui';

import { SliderStd } from '../../standard_ui/standard_ui';
import { ComboBoxStd } from '../../standard_ui/standard_ui';

import ElementView from '../../components/ElementView.jsx';

import { Element } from './Elements.js';

import { sortAlgoNames, ranges } from './sort_resources_2';

function SortView({ prElements, prNumElements, prIndexSelectedSortAlgo, prSpeed, prOnChangeSliderSpeed, 
                    prOnPlayPause, prOnChangeSliderNumEls, prOnPressBtnSortDir, prOnPressCmbSortAlgo, 
                    prOnPressBtnShuffle, prOnPressBtnStop, prOnPressBtnVolume, prOnPressChangeDirection, prUpdater,
                    prRefBtnStop, prRefBtnSkipNext, prRefBtnSkipPrev, prRefBtnPlayPause, prIsSorting, prIsPaused, 
                    prIsAscending, prIsVolumeOn }) 
{

    // Acquire global theme.
    const { themeName } = useTheme();
    let lTheme = (themeName && themeName in themes) ? themes[themeName] : themes[defaultTheme];

    const windowSize = useWindowSize();

    const navigate = useNavigate();

    const lStyleCon = useMemo(
        () =>
        {
            return windowSize.isLandscape ? styles.containerLandscape : styles.containerPortrait;
        },
        [ windowSize ]
    );

    const lStyleConComboBox = useMemo(
        () =>
        {
            return windowSize.isLandscape ? styles.conComboBoxLandscape : styles.conComboBoxPortrait;
        },
        [ windowSize ]
    );

    const lStyleConElements = useMemo(
        () =>
        {
            return windowSize.isLandscape ? styles.conElementsLandscape : styles.conElementsPortrait;
        },
        [ windowSize ]
    );

    const lStyleConSliders = useMemo(
        () =>
        {
            return windowSize.isLandscape ? { ...styles.conSliders, ...styles.conSlidersLandscape } : 
                                            { ...styles.conSliders, ...styles.conSlidersPortrait };
        },
        [ windowSize ]
    );

    const lStyleBtnSortDirection = useMemo(
        () =>
        {
            return windowSize.isLandscape ? styles.btnSortDirectionLandscape : styles.btnSortDirectionPortrait;
        },
        [ windowSize ]
    );

    // Props related to the buttons.
    let lButtonProps = useMemo(
        () => 
        { 
            // The total available space along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSpaceAvailable = windowSize.isLandscape ? windowSize.height : windowSize.width;

            // The size of the gap between the buttons along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lGap = windowSize.isLandscape ? lSpaceAvailable * 0.04 : lSpaceAvailable * 0.04;

            // The size of each button along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSize = (lSpaceAvailable - 2 * styles.conButtons.padding - 5 * lGap - 12 * styles.button.con.padding) / 6;

            return { size: lSize, gap: lGap }; 
        },
        [ windowSize ]
    );

    // The total space available for the elements (in the direction in which they're displayed.).
    const lSpaceForElements = useMemo(
        () => 
            { 
                let lWidthAvailable = Math.floor(
                    windowSize.width - // window width
                    2 * styles.containerLandscape.con.padding - // outer container padding
                    2 * styles.conElementsLandscape.padding - // elements container padding
                    50 - // combobox
                    2 * 50 - // sliders
                    lButtonProps.size - // button icon height.
                    2 * styles.button.con.padding - // padding applied to the buttons.
                    2 * styles.conButtons.padding - // padding applied to the buttons' container;
                    3 * styles.containerLandscape.con.columnGap - // the total gaps between the three four 'segments'.
                    1 // sometimes it can be a little off.
                );


                console.log(`Window Size: ${windowSize.width}`);
                console.log(`Button Size: ${lButtonProps.size}`);
                console.log(`Space for elements: ${lWidthAvailable}`);

                return lWidthAvailable;
            }, 
        [ windowSize, lButtonProps ]
    ); 

    // The width of each element (%). This is the size measured along the direction in which the elements are displayed.
    const lWidthElement = useMemo(
        () => 
        { 
            return `${100.0 / prElements.length}%`; 
        },
        [ prElements ] 
    );

    const lStyleButtonIcon = useMemo(
        () =>
        {
            return {
                fill: "#ffffff", fontSize: lButtonProps.size
            };
        },
        [ themeName, lButtonProps ]
    );

    const lStyleConButtons = useMemo(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return {
                    ...styles.conButtons, ...styles.conButtonsLandScape, rowGap: lButtonProps.gap
                };
            }
            else
            {
                return {
                    ...styles.conButtons, ...styles.conButtonsPortrait, columnGap: lButtonProps.gap
                };
            }
        },
        [ themeName, lButtonProps, windowSize ]
    );

    const lStyleSlider = useMemo(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return { 
                    con: {
                        border: "none",
                        borderLeft: `1px solid ${"#ffffff"}`,
                    }
                };
            }
            else
            {
                return { 
                    con: {
                        border: "none",
                        borderTop: `1px solid ${"#ffffff"}`
                    }
                };
            }
        },
        [ themeName, windowSize ]
    );

    const lStyleComboBox = useMemo(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return { 
                    con: { 
                        border: "none", borderRight: `1px solid #ffffff`, 
                        flexGrow: 1, width: 50
                    },
                    conItems: {
                        border: "none", borderRight: `1px solid #ffffff`, borderTop: `1px solid #ffffff`, 
                    }
                };
            }
            else
            {
                return { 
                    con: { 
                        border: "none", borderBottom: `1px solid #ffffff`, 
                        flexGrow: 1, height: 50,
                        width: 1, // Width is required to be set so that flexGrow works.
                    },
                    conItems: {
                        border: "none", borderLeft: `1px solid #ffffff`, borderBottom: `1px solid #ffffff`, 
                    }
                };
            }
        },
        [ themeName, windowSize ]
    );

    const lStyleIconBtnSortDir = useMemo(
        () =>
        {
            return { fill: "#ffffff", fontSize: 35 }
        },
        [ themeName ]
    );

    const lIconBtnSortDir = useMemo(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return prIsAscending ? <ArrowForwardIcon sx = { lStyleIconBtnSortDir } /> :
                                       <ArrowBackIcon sx = { lStyleIconBtnSortDir } />;
            }
            else
            {
                return prIsAscending ? <ArrowDownwardIcon sx = { lStyleIconBtnSortDir } /> :
                                       <ArrowUpwardIcon sx = { lStyleIconBtnSortDir } />;
            }
        },
        [ themeName, prIsAscending, windowSize ]
    );

    const lIconBtnPlayPause = useMemo(
        () =>
        {
            return (!prIsSorting || prIsPaused) ? <PlayArrowIcon sx = { lStyleButtonIcon } /> :
                                                  <PauseIcon sx = { lStyleButtonIcon } />
        },
        [ lStyleButtonIcon, prIsPaused, prIsSorting ]
    );

    const lIconBtnVolume = useMemo(
        () =>
        {
            return prIsVolumeOn ? <VolumeUpIcon sx = { lStyleButtonIcon } /> :
                                  <VolumeOffIcon sx = { lStyleButtonIcon } />
        },
        [ lStyleButtonIcon, prIsVolumeOn ]
    );

    return ( 
        <PageContainerStd
            prNavigate = { navigate }
            prShowHeader = { false }
            prStyles = { lStyleCon } prTheme = { lTheme }
        >

            <div style = { lStyleConComboBox }>
                <ButtonStd 
                    prIcon = { lIconBtnSortDir }
                    prStyles = { lStyleBtnSortDirection } prIsBorderDisabled = { false }
                    prOnPress = { prOnPressBtnSortDir }
                    prIsActive = { !prIsSorting }
                />
                <ComboBoxStd
                    prItems = { sortAlgoNames } prIndexSelected = { prIndexSelectedSortAlgo }
                    prDirection = { windowSize.isLandscape ? "r" : "d" } 
                    prLength = { windowSize.isLandscape ? undefined : "100%" } 
                    prOnPress = { prOnPressCmbSortAlgo }
                    prHideScrollBar = { false }
                    prMaxLengthItemBox = { windowSize.isLandscape ? Math.min(windowSize.width * 0.4, 400) : Math.min(windowSize.height * 0.4, 400) }
                    prWidth = { windowSize.isLandscape ? 50 : undefined }
                    prHeight = { windowSize.isLandscape ? undefined : 50 }
                    prStyles = { lStyleComboBox }
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render elements */}
            <div style = { lStyleConElements } className = "hideScrollBar" onClick = { prOnPressChangeDirection }>
                {
                    prElements.map(
                        (element, index) =>
                        {
                            let lWidthOuter = (index == 0 || element.value > prElements[index - 1].value) ? 
                                                element.value : prElements[index - 1].value;

                            return (
                                <ElementView
                                    key = { index } 
                                    prElement = { element }
                                    prLengthOuter = { lWidthOuter }
                                    prLengthOuterStatic = { lWidthElement }
                                    prLengthInnerStatic = "100%"
                                    prIsColumn = { windowSize.isLandscape }
                                    prIsLastElement = { index == prElements.length - 1 }
                                    prTheme = { lTheme?.element }
                                    prUpdater = { prUpdater }
                                />
                            );
                        }
                    )
                }
            </div>

            <div style = { lStyleConSliders }>
                <SliderStd 
                    prIsVertical = { windowSize.isLandscape } prIsVerticalTopDown
                    prMin = { 1 } prMax = { ranges.speed.max } prValue = { ranges.speed.max - prSpeed + 1 } prStep = { 1 }
                    prMinAllowed = { ranges.speed.min }
                    prOnChange = { prOnChangeSliderSpeed }
                    // prShowValue = { false }
                    prLabel = "SPEED"
                    prHeight = { windowSize.isLandscape ? window.innerHeight : 50 }
                    prWidth = { windowSize.isLandscape ? 50 : undefined }
                    prStyles = { lStyleSlider }
                />

                <SliderStd 
                    prIsVertical = { windowSize.isLandscape } prIsVerticalTopDown
                    prMin = { 1 } prMax = { Math.min(ranges.numElements.max, lSpaceForElements)} prValue = { prNumElements } prStep = { 1 }
                    prMinAllowed = { ranges.numElements.min }
                    prOnChange = { prOnChangeSliderNumEls }
                    prLabel = "LENGTH"
                    prHeight = { windowSize.isLandscape ? window.innerHeight : 50 }
                    prWidth = { windowSize.isLandscape ? 50 : undefined }
                    prStyles = { lStyleSlider } 
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render buttons */}
            <div style = { lStyleConButtons } className = "hideScrollBar"> 
                <ButtonStd 
                    prIcon = { lIconBtnPlayPause }
                    prStyles = { styles.button }
                    prRef = { prRefBtnPlayPause }
                    prOnPress = { prOnPlayPause }
                />
                <ButtonStd 
                    prIcon = { <SkipNextIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prRef = { prRefBtnSkipNext }
                    prIsActive = { !prIsSorting || prIsPaused }
                />
                <ButtonStd 
                    prIcon = { <SkipPreviousIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prRef = { prRefBtnSkipPrev }
                    prIsActive = { !prIsSorting || prIsPaused }
                />
                <ButtonStd 
                    prIcon = { <StopIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prRef = { prRefBtnStop }
                    prOnPress = { prOnPressBtnStop }
                />
                <ButtonStd 
                    prIcon = { <ShuffleIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prOnPress = { prOnPressBtnShuffle }
                    prIsActive = { !prIsSorting }
                />
                <ButtonStd 
                    prIcon = { lIconBtnVolume }
                    prStyles = { styles.button }
                    prOnPress = { prOnPressBtnVolume }
                />
            </div>

        </PageContainerStd>
    );
}

const styles = 
{
    containerLandscape:
    {
        con:
        {
            alignItems: "center",
            flexDirection: "row",
            padding: 0,
            columnGap: 15
        }
    },
    containerPortrait:
    {
        con:
        {
            flexDirection: "column",
            padding: 0,
            rowGap: 15
        }
    },

    comboBox:
    {
        con:
        {
            flexGrow: 1, flexShrink: 0,
            width: 50
        }
    },

    conButtons: 
    {
        justifyContent: "center",
        padding: 10
    },
    conButtonsLandScape: 
    {
        height: "100%",
        flexDirection: "column",
    },
    conButtonsPortrait: 
    {
        width: "100%",
        flexDirection: "row",
    },

    button:
    {
        con:
        {
            padding: 3,
            flexShrink: 0
        }
    },
    conSliders:
    {
        alignSelf: "flex-start",
        flexShrink: 0,
        flexGrow: 0,
    },
    conSlidersLandscape:
    {
        alignSelf: "flex-start",
        height: "100%",
        minHeight: "100%",
        flexDirection: "row",
        flexShrink: 0,
        flexGrow: 0,
        columnGap: 0
    },
    conSlidersPortrait:
    {
        alignSelf: "flex-start",
        width: "100%",
        flexDirection: "column",
        flexShrink: 0,
        flexGrow: 0,
        rowGap: 0
    },
    slider:
    {
        con:
        {
            border: "none",
        },
    },
    conElementsLandscape:
    {
        flexGrow: 1, 
        height: "100%", 
        flexDirection: "row", 
        alignItems: "flex-end", justifyContent: "center", 
        overflowX: "scroll",
        padding: 10,
    },
    conElementsPortrait:
    {
        flexGrow: 1, 
        width: "100%", 
        flexDirection: "column", 
        alignItems: "start", justifyContent: "start", 
        padding: 10, 
        overflowY: "scroll",
    },
    combobox:
    {
        con:
        {
            border: "none",
        }
    },
    conComboBoxLandscape:
    {
        flexDirection: "column",
        height: "100%",
        flexShrink: 0,
    },
    conComboBoxPortrait:
    {
        flexDirection: "row",
        width: "100%",
        flexShrink: 0,
    },
    btnSortDirectionLandscape:
    {
        con:
        {
            width: "100%",
            borderLeft: "none",
            borderTop: "none",
            borderRadius: 0,
            padding: 5,
        }
    },
    btnSortDirectionPortrait:
    {
        con:
        {
            height: "100%",
            borderLeft: "none",
            borderTop: "none",
            borderRadius: 0,
            padding: 5,
            flexShrink: 0
        }
    },
};

export default SortView;