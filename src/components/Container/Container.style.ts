import { css } from '../../utils/picostyle';
import * as Token from '../../utils/token';

export const container = css({
  backgroundColor: Token.pageBackgroundColor,
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const wrapper = css({
  width: "576px",
  height: "900px",
  backgroundColor: Token.wrapperColor,
  display: "flex",
  flexDirection: "column",
  borderRadius: "20px"
});

