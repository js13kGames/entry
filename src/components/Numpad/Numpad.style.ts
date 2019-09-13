import { css } from '../../utils/picostyle';
import * as Token from '../../utils/token';

export const keys = css({
  flex: "1",
  paddingTop: "32px",
  paddingLeft: "48px",
  paddingRight: "48px",
  paddingBottom: "32px",
  display: "flex",
  flexDirection: "column",
})

export const row = css({
  flex: "1",
  display: "flex",
});

export const button = css({
  position: "relative",
  top: "0px",
  marginTop: "0px",
  marginBottom: "10px",
  

  height: "100%",
  border: "0px",
  cursor: "pointer",
  width: "100%",
  color: "#fff",
  fontFamily: "sans-serif",
  fontSize: "40px",
  borderRadius: "8px",
  opacity: "0.9",
  '&:active': {
    boxShadow: "none",
    top: "0px",
    marginBottom: "0px",
  },
  '&:hover': {
    opacity: 1,
  }
});

export const column = css({
  flex: "1",
  margin: "8px",
  display: "flex",
  backgroundColor: "#b6b0a4",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  boxShadow: "inset 0px 8px 0px 0px #cdc5ba",
  [`&:active ${button}`]: {
    boxShadow: "none",
    top: "0px",
    marginBottom: "0px",
  }
});

/**
 * Button Variants
 */

export const buttonPlus = css({
  backgroundColor: "#45494c",
  boxShadow: "0px 10px 0px 0px #1a1a1c",
});
export const buttonClear = css({
  backgroundColor: "#c62e2d",
  boxShadow: "0px 10px 0px 0px #962223",
});
export const buttonAppend = css({
  backgroundColor: "#8a7bd8",
  boxShadow: "0px 10px 0px 0px #463a86",
});
export const buttonShift = css({
  backgroundColor: "#ec6c15",
  boxShadow: "0px 10px 0px 0px #b54900",
});
export const buttonConvert = css({
  fontSize: "24px",
  backgroundColor: "#ec6c15",
  boxShadow: "0px 10px 0px 0px #b54900",
});
export const buttonHelp = css({
  backgroundColor: "#24a19d",
  boxShadow: "0px 10px 0px 0px #1a7671",
});
export const buttonOk = css({
  backgroundColor: "#48ad2f",
  boxShadow: "0px 10px 0px 0px #368323",
});

