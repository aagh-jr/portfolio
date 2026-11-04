// Lucide icons (ISC), inlined: lucide-react is not a portfolio dependency.
// Generated from lucide-react 0.575.0; same props as lucide-react for the ones used.
import { createElement, type SVGProps } from "react"

type Node = [string, Record<string, string>][]
type P = { size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>

function make(node: Node) {
  return function Icon({ size = 24, strokeWidth = 2, ...rest }: P) {
    return createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...rest }, node.map(([t, a], i) => createElement(t, { ...a, key: i })))
  }
}

export const Check = make([["path",{"d":"M20 6 9 17l-5-5"}]])
export const ChevronDown = make([["path",{"d":"m6 9 6 6 6-6"}]])
export const GripVertical = make([["circle",{"cx":"9","cy":"12","r":"1"}],["circle",{"cx":"9","cy":"5","r":"1"}],["circle",{"cx":"9","cy":"19","r":"1"}],["circle",{"cx":"15","cy":"12","r":"1"}],["circle",{"cx":"15","cy":"5","r":"1"}],["circle",{"cx":"15","cy":"19","r":"1"}]])
export const Search = make([["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]])
export const X = make([["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]])
export const ArrowRight = make([["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]])
export const ArrowUp = make([["path",{"d":"m5 12 7-7 7 7"}],["path",{"d":"M12 19V5"}]])
export const Barcode = make([["path",{"d":"M3 5v14"}],["path",{"d":"M8 5v14"}],["path",{"d":"M12 5v14"}],["path",{"d":"M17 5v14"}],["path",{"d":"M21 5v14"}]])
export const MessageCircle = make([["path",{"d":"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"}]])
export const Bookmark = make([["path",{"d":"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"}]])
export const CirclePlus = make([["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M8 12h8"}],["path",{"d":"M12 8v8"}]])
export const FileSearch = make([["path",{"d":"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["circle",{"cx":"11.5","cy":"14.5","r":"2.5"}],["path",{"d":"M13.3 16.3 15 18"}]])
export const ShoppingCart = make([["circle",{"cx":"8","cy":"21","r":"1"}],["circle",{"cx":"19","cy":"21","r":"1"}],["path",{"d":"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"}]])
