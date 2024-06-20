import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import HeaderStd from '../header_std/HeaderStd.jsx';
import NavBarStd from '../nav_bar_std/NavBarStd.jsx';
import NavBarSingleStd from '../nav_bar_single_std/NavBarSingleStd.jsx';
import PopUpStd from '../pop_up_std/PopUpStd.jsx';


/**
* This is the parent component of every page, meaning that it should wrap every page of the application.
* Expected Behaviour: if the supplied children elements do not fill the entire vertical space between the header and 
  footer, the container is expected to take 100% of this space. This is ideal because one may want to center the content
  vertically, such as on a log-in screen, where the input fields are typically centered.

* Props:
    > children: any children components.
    > prNavigate: the navigate object.
    > prShowHeader: whether the header is displayed.
    > prButtonNavBarText: the text of the single nav-bar buttons.
    > prButtonNavBarHandler: the onPress function of the single nav-bar button. For the NavBarSingleStd component to be'
      displayed, both this prop and prButtonNavBarText must be defined; moreover, prOptionsNavBarButtons must be falsy.
    > prOptionsLeftHeaderButtons: this prop is passed as the prOptionsLeftButtons of the page's HeaderStd component.
    > prOptionsRightHeaderButtons: this prop is passed as the prOptionsRightButtons of the page's HeaderStd component.
    > prOptionsPopUpMsg: an object which defines the content of the pop-up message. If undefined/falsy (which it is by 
      default), a pop-up message isn't displayed. The properties of this object that are used are the props of the 
      PopUpStandard component.
    > prOptionsNavBarButtons: this prop is passed as the prOptionsButtons of the page's NavBarStd component. If this 
      prop is defined, the prButtonNavBarText and prButtonNavBarHandler are ignored.
    * @param {object} prStyles - An object in which to include styling objects for the page's content container (.con), 
      the HeaderStd component (.header), the NavBarSingleStd component (.navBarSingle), and the NavBarStd component 
      (.navBar). These properties are passed to the respective components' prStyles prop (or the prStyle prop, if 
      prStyles doesn't exist for that object).
    > prStyle: an optional styling object for the container of the content.
    > prStyleHeader: the style of the Header component (i.e. of its container).
    > prIconSizeHeader: the size of the header's icons.
    > prLogo: the app's logo (optional).
    > prTheme: An entire theme object (see themes_default for examples).
*/
function PageContainerStd({ children, prNavigate, prShowHeader, prButtonNavBarText, prButtonNavBarHandler, 
                            prOptionsLeftHeaderButtons, prOptionsRightHeaderButtons, prOptionsPopUpMsg, 
                            prOptionsNavBarButtons, prStyles, prIconSizeHeader, prIconSizeNavBar, 
                            prLogo, prTheme })
{
    // The object that defines the contents of the pop-up message.
    const [ stOptionsPopUpMsg, setOptionsPopUpMsg ] = useState(undefined);

    // Whether the (onscreen) keyboard is displayed.
    const [ stIsKeyboardActive, setIsKeyboardActive ] = useState(false);

    /*
    * Show/hide the pop-up message.
    */
    useEffect(
        () =>
        {
            if (!prOptionsPopUpMsg)
                setOptionsPopUpMsg(undefined);
            else
                setOptionsPopUpMsg(prOptionsPopUpMsg);
        },
        [ prOptionsPopUpMsg ]
    );

    return ( 
        <div style = {{ ...styles.container, backgroundColor: prTheme.pageContainer.background }}>

            {
                (stOptionsPopUpMsg) && 
                    <PopUpStd 
                        { ...stOptionsPopUpMsg } 
                        prRemovePopUp = { () => setOptionsPopUpMsg(undefined) } 
                        prTheme = { prTheme.popUpStandard }
                        prThemeCheckBox = { prTheme.checkBox }
                    />
            }

            {
                prShowHeader && (
                    <HeaderStd 
                        prNavigate = { prNavigate }
                        prOptionsLeftButtons = { prOptionsLeftHeaderButtons }
                        prOptionsRightButtons = { prOptionsRightHeaderButtons }
                        prSetOptionsPopUpMsg = { setOptionsPopUpMsg }
                        prStyle = { prStyles?.header } prIconSize = { prIconSizeHeader }
                        prLogo = { prLogo }
                        prTheme = { prTheme.header }
                    />
                )
            }

            <div 
                className = "hideScrollBar"
                style = {{ ...styles.content, ...prStyles?.con, }}
            > 
                { children }
            </div>

            {
                ((!prOptionsNavBarButtons && prButtonNavBarText && prButtonNavBarHandler) && !stIsKeyboardActive) && (
                    <NavBarSingleStd
                        prText = { prButtonNavBarText }
                        prOnPress = { prButtonNavBarHandler }
                        prStyles = { prStyles?.navBarSingle }
                        prTheme = { prTheme.navBarSingle }
                    />
                )
            }

            {
                (prOptionsNavBarButtons && !stIsKeyboardActive) && (
                    <NavBarStd
                        prOptionsButtons = { prOptionsNavBarButtons }
                        prStyle = { prStyles?.navBar } prIconSize = { prIconSizeNavBar }
                        prTheme = { prTheme.navBar }
                    />
                )
            }

        </div>
    );
}

PageContainerStd.propTypes =
{
    children: PropTypes.node,
    prNavigate: PropTypes.func.isRequired,
    prShowHeader: PropTypes.bool,
    prButtonNavBarText: PropTypes.string,
    prButtonNavBarHandler: PropTypes.func,
    prOptionsLeftHeaderButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func
            }
        )
    ),
    prOptionsRightHeaderButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func
            }
        )
    ),
    prOptionsNavBarButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                text: PropTypes.string.isRequired,
                pageName: PropTypes.string.isRequired,
            }
        )
    ),
    prOptionsPopUpMsg: PropTypes.object,
    prStyle: PropTypes.object,
    prStyleHeader: PropTypes.object,
    prIconSizeHeader: PropTypes.number,
    prLogo: PropTypes.node,
    prTheme: PropTypes.object
};

PageContainerStd.defaultProps =
{
    prShowHeader: true,
    prButtonNavBarText: "",
    prButtonNavBarHandler: undefined,
    prOptionsPopUpMsg: undefined,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            header: PropTypes.object,
            navBarSingle: PropTypes.object,
            navBar: PropTypes.object,
        }
    ),
    prTheme:
    {
        pageContainer: 
        {
            backgroundColor: "#272727",

            header: 
            {
                backgroundColor: "#000000",
                borderColor: "#FAFAFA",
                icon: "#FAFAFA"
            },

            navBarSingle: 
            {
                backgroundColor: "#000000",
                borderColor: "#FAFAFA",
                fontColor: "#FFFFFF",
                buttonBackgroundColor: "#272727",
                buttonBorderColor: "#FAFAFA"
            },

            navBar: 
            {
                backgroundColor: "#000000",
                borderColor: "#FAFAFA",
                fontColor: "#FFFFFF",
                iconActive: "#FFFFFF",
                iconInActive: "#272727",
            },

            popUpStandard:
            {
                backgroundColorTransparent: "#00000099",
                backgroundColor: "#272727",
                borderColor: "#FAFAFA",

                buttonBackgroundColor: "#000000",
                buttonBorderColor: "#FAFAFA",
                buttonFontColor: "#FFFFFF"
            }
        },

        checkBox: 
        {
            backgroundColor: "#272727",
            checkBoxActive: "#9B8509",
            checkBoxInactive: "#ffffff",
            fontColor: "#ffffff",
        },
    }
};

const styles = 
{
    container:
    {
        flex: 1,
        overflow: 'hidden',
        flexDirection: "column",
        alignItems: "center"
    },
    content: 
    {
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
        overflowY: "scroll",
        width: "100%",
        padding: 20
    }
}


export default PageContainerStd;