import React from "react";
import { createElement, forwardRef, Fragment, ReactNode, useEffect, useRef, useState } from "react";

function getCentroid(element: Element): [number, number] | null {
  // Try SVG bbox centroid
  if ('getBBox' in element) {
    try {
      const bbox = (element as SVGGraphicsElement).getBBox();
      return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    } catch {
      return null;
    }
  }
  return null;
}

function convertNodeToElement(node: Element, props: any = {}): React.ReactNode {
  const tag = node.tagName;
  const attribs: Record<string, any> = {};

  for (const attr of Array.from(node.attributes)) {
    attribs[attr.name] = attr.value;
  }

  // Recursively convert children
  const childElements = Array.from(node.children).map((child) =>
    convertNodeToElement(child)
  );

  return createElement(tag, { ...attribs, ...props }, childElements.length > 0 ? childElements : undefined);
}

export default function SVGReactComponent(fragment: string) {
  const parser = new DOMParser();

  const doc = parser.parseFromString(`<svg>${fragment}</svg>`, "image/svg+xml");

  const parent = doc.documentElement;

  if (!parent.children[0]) {
    console.log(doc.documentElement.outerHTML);
  }
  const root = parent.children[0];

  return forwardRef<SVGElement, React.SVGProps<SVGElement>>(function SvgComponent(props, ref) {
    const tag = root.tagName;
    const attribs: Record<string, any> = {};

    for (const attr of Array.from(root.attributes)) {
      attribs[attr.name] = attr.value;
    }

    const children = Array.from(root.children).map(convertNodeToElement);

    return createElement(tag, { ...attribs, ...props, ref }, children.length > 0 ? children : undefined);
  });
}
