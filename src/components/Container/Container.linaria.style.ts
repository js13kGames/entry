import { css } from 'linaria';
import * as Token from '../../utils/token';

export const container = css`
  background-color: ${Token.pageBackgroundColor};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const wrapper = css`
  width: 576px;
  height: 900px;
  background-color: ${Token.wrapperColor};
  display: flex;
  flex-direction: column;
  border-radius: 20px;
`;

