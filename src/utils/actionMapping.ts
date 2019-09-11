import { ChoiceType } from "../states/screen";
import { Action } from "../actions/actions";

export const getActionToInvoke = (type: ChoiceType): keyof Action => {
  switch (type) {
    case ChoiceType.ADDITION:
      return "addOperator";
    case ChoiceType.MULTIPLY:
      return "multiplyOperator";
    case ChoiceType.DIVISION:
      return "divisionOperator";
    case ChoiceType.DELETE:
      return "deleteOperator";
    default:
      // cuma biar lolos typechecking
      return "addOperator";
  }
};
