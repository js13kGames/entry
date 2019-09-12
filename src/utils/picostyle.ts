
import { h, VNode } from "hyperapp";
import picostyle, { createNode, PicoObject } from "picostyle";

const pStyle = <PicoObject>picostyle(h as createNode, { returnObject : true });

export const style = pStyle.style;
export const css = pStyle.css;