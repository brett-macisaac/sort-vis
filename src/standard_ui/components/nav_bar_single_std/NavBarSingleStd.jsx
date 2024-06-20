import React from "react";
import PropTypes from 'prop-types';


function NavBarSingleStd({ prText, prOnPress, prStyles, prTheme })
{
    return (
        <div 
            style = {{ 
                ...styles.container, backgroundColor: prTheme.background, borderTopColor: prTheme.border, 
                ...prStyles?.con 
            }}
        >
            <ButtonStandard 
                prText = { prText }
                prOnPress = { prOnPress }
                prStyle = {{ 
                    ...styles.button, backgroundColor: prTheme.backgroundButton, borderColor: prTheme.border,
                    color: prTheme.font, 
                    ...prStyles?.button
                }}
            />
        </div>
    );
}

NavBarSingleStd.propTypes =
{
    prText: PropTypes.string.isRequired,
    prOnPress: PropTypes.func.isRequired,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            button: PropTypes.object,
        }
    ),
};

const styles =
{
    container:
    {
        alignItems: "center",
        justifyContent: "center",
        // height: globalProps.heightNavBar,
        padding: 10,
        borderTop: "1px solid",
        width: "100%"
    },
    button:
    {
        width: "80%",
        maxWidth: 500,
        alignItems: "center",
        padding: 10,
        borderRadius: 10
        // marginTop: utilsGlobalStyles.spacingN(-2),
        // marginBottom: utilsGlobalStyles.spacingN(-2),
        //borderRadius: globalProps.borderRadiusStandard,
    },
};

export default NavBarSingleStd;