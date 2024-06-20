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

import { globalStyles } from '../../styles';
import themes, { defaultTheme } from '../../themes/themes.js';

import { ButtonStd } from "../../standard_ui/standard_ui";
import { PageContainerStd } from "../../standard_ui/standard_ui";
import { useTheme } from "../../standard_ui/standard_ui";
import { useWindowSize } from '../../standard_ui/standard_ui';

import { SliderStd } from '../../standard_ui/standard_ui';
import { ComboBoxStd } from '../../standard_ui/standard_ui'

import ElementView from '../../components/ElementView.jsx';

import { sortAlgoNames, ranges } from './sort_resources_2';

function SortPortrait({ prElements, prNumElements, prIndexSelectedSortAlgo, prSpeed, prOnChangeSliderSpeed, 
                        prOnPlayPause, prOnChangeSliderNumEls, prOnPressBtnSortDir, prOnPressCmbSortAlgo, 
                        prOnPressBtnShuffle, prOnPressBtnStop, prOnPressBtnVolume, prOnPressChangeDirection, prUpdater,
                        prRefBtnStop, prRefBtnSkipNext, prRefBtnSkipPrev, prRefBtnPlayPause, prIsSorting, prIsPaused, 
                        prIsAscending, prIsVolumeOn }) 
{
    // Acquire global theme.
    const { themeName } = useTheme();
    let lTheme = (themeName && themeName in themes) ? themes[themeName] : themes[defaultTheme];

    const { windowSize } = useWindowSize();

    const navigate = useNavigate();

    // The height of each element (%).
    const lHeightElement = useMemo(
        () => 
        { 
            return `${100.0 / prElements.length}%`; 
        },
        [ prElements ] 
    );

    // Props related to the buttons.
    let lButtonProps = useMemo(
        () => 
        { 
            let lColGap = windowSize.width * 0.04;

            let lSize = (windowSize.width - 2 * styles.conButtons.padding - 5 * lColGap - 12 * styles.button.con.padding) / 6

            return { size: lSize, colGap: lColGap }; 
        },
        [ windowSize ]
    );

    // The total vertical space available for the elements.
    const lSpaceForElements = useMemo(
        () => 
            { 
                let lHeightAvailable = Math.floor(
                    windowSize.height - // window height
                    2 * styles.container.con.padding - // outer container padding
                    2 * styles.conElements.padding - // elements container padding
                    50 - // combobox
                    2 * 50 - // sliders
                    lButtonProps.size - // button icon height.
                    2 * styles.button.con.padding - // padding applied to the buttons.
                    2 * styles.conButtons.padding - // padding applied to the buttons' container;
                    3 * styles.container.con.rowGap - // the total gaps between the three four 'segments'.
                    1 // sometimes it can be a little off.
                );

                console.log(`Space for elements: ${lHeightAvailable}`);

                return lHeightAvailable;
            }, 
        [ windowSize, lButtonProps ]
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
            return {
                ...styles.conButtons, columnGap: lButtonProps.colGap
            };
        },
        [ themeName, lButtonProps ]
    );

    const lStyleSlider = useMemo(
        () =>
        {
            return { 
                con: {
                    border: "none",
                    borderTop: `1px solid ${"#ffffff"}`
                }
            };
        },
        [ themeName ]
    );

    const lStyleComboBox = useMemo(
        () =>
        {
            return { 
                con: { 
                    border: "none", borderBottom: `1px solid #ffffff`, 
                    flexGrow: 1, width: 1, // Width is required to be set so that flexGrow works.
                    height: 50
                },
                conItems: {
                    border: "none", borderLeft: `1px solid #ffffff`, borderBottom: `1px solid #ffffff`, 
                }
            };
        },
        [ themeName ]
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
            return prIsAscending ? <ArrowUpwardIcon sx = { lStyleIconBtnSortDir } /> :
                                   <ArrowDownwardIcon sx = { lStyleIconBtnSortDir } />;
        },
        [ themeName, prIsAscending ]
    );

    return ( 
        <PageContainerStd
            prNavigate = { navigate }
            prShowHeader = { false }
            prStyles = { styles.container } prTheme = { lTheme }
        >

            <div style = { styles.conTop }>
                <ButtonStd 
                    prIcon = { lIconBtnSortDir }
                    prStyles = { styles.btnSortDirection } prIsBorderDisabled = { false }
                    prOnPress = { prOnPressBtnSortDir }
                    prIsActive = { !prIsSorting }
                />
                <ComboBoxStd
                    prItems = { sortAlgoNames } prIndexSelected = { prIndexSelectedSortAlgo }
                    prLength = "100%"
                    prOnPress = { prOnPressCmbSortAlgo }
                    prMaxLengthItemBox = { Math.min(window.innerHeight * 0.4, 400) }
                    prHideScrollBar = { false }
                    prStyles = { lStyleComboBox } prHeight = { 50 }
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render elements. */}
            <div style = { styles.conElements } className = "hideScrollBar">
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
                                    prLengthOuterStatic = { lHeightElement }
                                    prLengthInnerStatic = "100%"
                                    prIsLastElement = { index == prElements.length - 1 }
                                    prTheme = { lTheme?.element }
                                    prUpdater = { prUpdater }
                                />
                            );
                        }
                    )
                }
            </div>

            <div style = { styles.conSliders } >
                <SliderStd 
                    prMin = { 1 } prMax = { ranges.speed.max } prValue = { ranges.speed.max - prSpeed + 1 } prStep = { 1 }
                    prMinAllowed = { ranges.speed.min }
                    prOnChange = { prOnChangeSliderSpeed }
                    prLabel = "SPEED"
                    prStyles = { lStyleSlider } prHeight = { 50 }
                />

                <SliderStd 
                    prMin = { 1 } prMax = { Math.min(ranges.numElements.max, lSpaceForElements)} prValue = { prNumElements } prStep = { 1 }
                    prMinAllowed = { ranges.numElements.min }
                    prOnChange = { prOnChangeSliderNumEls }
                    prLabel = "LENGTH"
                    prStyles = { lStyleSlider } prHeight = { 50 }
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render buttons. */}
            <div style = { lStyleConButtons } className = "hideScrollBar">
                <ButtonStd 
                    prIcon = { 
                        (!prIsSorting || prIsPaused) ? 
                        <PlayArrowIcon sx = { lStyleButtonIcon } /> :
                        <PauseIcon sx = { lStyleButtonIcon } />
                    }
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
                    prIcon = { 
                        (prIsVolumeOn) ? 
                        <VolumeUpIcon sx = { lStyleButtonIcon } /> :
                        <VolumeOffIcon sx = { lStyleButtonIcon } />
                    }
                    prStyles = { styles.button }
                    prOnPress = { prOnPressBtnVolume }
                />
            </div>

        </PageContainerStd>
    );
}

SortPortrait.propTypes =
{
    prElements: PropTypes.arrayOf(PropTypes.instanceOf(Element)).isRequired,
    prNumElements: PropTypes.number.isRequired,
    prIndexSelectedSortAlgo: PropTypes.number.isRequired,
    prSpeed: PropTypes.number.isRequired,
    prOnChangeSliderSpeed: PropTypes.func.isRequired,
    prOnChangeSliderNumEls: PropTypes.func.isRequired,
};

const styles = 
{
    container:
    {
        con:
        {
            flexDirection: "column",
            padding: 0,
            rowGap: 15
        }
    },
    conTop:
    {
        flexDirection: "row",
        width: "100%",
        flexShrink: 0,
    },
    conElements:
    {
        flexGrow: 1, width: "100%", 
        flexDirection: "column-reverse", alignItems: "start", justifyContent: "start", 
        padding: 10, overflowY: "scroll",
    },
    conSliders:
    {
        alignSelf: "flex-start",
        width: "100%",
        flexDirection: "column",
        flexShrink: 0,
        flexGrow: 0,
        rowGap: 0
    },
    conButtons: 
    {
        width: "100%",
        columnGap: 10,
        flexDirection: "row",
        justifyContent: "center",
        padding: 10
    },
    button:
    {
        con:
        {
            padding: 3,
            flexShrink: 0
        }
    },
    btnSortDirection:
    {
        con:
        {
            ...globalStyles.textStandardDefault,
            ...globalStyles.buttonStandardDefault,
            height: "100%",
            // backgroundColor: "#000000",
            borderLeft: "none",
            borderTop: "none",
            borderRadius: 0,
            padding: 5,
            flexShrink: 0
        }
    }
};

export default SortPortrait;