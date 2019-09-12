import { css } from '../../utils/picostyle';
import * as Token from '../../utils/token';

export const display = css({
  flex: 1,
  padding: "48px",
})

export const displayWrapper = css({
  backgroundColor: Token.displayBgColor,
  borderRadius: "25px",
  height: "100%",
  padding: "16px",
});

/**
 * Display Headers
 */

export const displayHeader = css({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  padding: "4px",
});

export const displayLevel = css({
  fontSize: "28px",
  padding: "8px",
  color: "white",
  fontFamily: "sans-serif",
});

export const displaySolarPanel = css({
  boxShadow: `inset 0px 4px 0px 0px ${Token.displaySolarPanelShdwColor}`,
  borderRadius: "4px",
  border: "2px solid #000",
  backgroundColor: Token.displaySolarPanelBgColor,
  width: "120px",
});

export const displaySolarPanelElement = css({
  borderRight: "2px solid #70453f",
  width: "28px",
  height: "100%",
  display: "inline-block",
});

/**
 * Display Body
 */

export const displayBody = css({
  boxShadow: `inset 0px 10px 0px 0px ${Token.displayBodyShdwColor}`,
  backgroundColor: Token.displayBodyBgColor,
  borderRadius: "12px",
  height: "300px",
  margin: "8px",
  padding: "8px",
});

export const displayBodyTitle= css({
  height: "75px",
  display: "flex",
  marginTop: "8px",
});

export const displayBodyTitleElement= css({
  borderRadius: "8px",
  flex: "1",
  margin: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
  fontSize: "16px",
});

export const displayBodyTitleElementEmoji= css({
  color: Token.displayBgDarkColor,
  fontWeight: "bolder",
  fontSize: "20px",
  borderRadius: "20px",
});

export const displayBodyTitleElementCounter= css({
  backgroundColor: Token.displayBgDarkColor,
  color: Token.displayFgLightColor,
});

export const displayBodyContent = css({
  color: Token.displayBgDarkColor,
  height: "200px",
  fontFamily: "digits",
  position: "relative",
});

export const displayBodyContentBackground = css({
  color: "#a1b29f",
  display: "flex",
  fontSize: "125px",
  justifyContent: "center",
  alignItems: "center",
});

export const displayBodyContentMain = css({
  color: Token.displayBgDarkColor,
  zIndex: "2",
  position: "absolute",
  top: "0px",
});

export const fontSizeNormal = css({
  fontSize: "125px",
});

export const fontSizeMini = css({
  fontSize: "40px",
});