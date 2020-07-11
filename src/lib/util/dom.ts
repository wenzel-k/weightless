/**
 * Renders attributes to the given element based on the `attrInfo` object where
 * boolean values are added/removed as attributes.
 * @param {*} element Element on which to set attributes.
 * @param {*} attrMap Object describing attributes.
 */
export function renderAttributes(element: HTMLElement, attrMap: { [key: string]: string | boolean | number }) {
	for (const a in attrMap) {
		const v = attrMap[a] === true ? "" : attrMap[a];
		if (v || v === "" || v === 0) {
			if (element.getAttribute(a) !== v) {
				element.setAttribute(a, v.toString());
			}
		} else if (element.hasAttribute(a)) {
			element.removeAttribute(a);
		}
	}
}

/**
 * Traverses the roots and returns the first match.
 * @param $elem
 * @param query
 */
export function queryParentRoots<T>($elem: Element, query: string): T[] {
	// If a shadow root doesn't exist we don't continue the traversal
	if ($elem.shadowRoot == null) {
		return [];
	}

	// Grab the rood node and query it
	const $root = (<any>$elem.shadowRoot.host).getRootNode();
	const matches = $root.querySelectorAll(query);
	if (matches.length > 0) {
		return <T[]>Array.from(matches);
	}

	// We continue the traversal if there was not matches
	return queryParentRoots($root, query);
}

/**
 * Traverses the tree of active elements down the shadow tree.
 * @param activeElement
 */
export function traverseActiveElements(activeElement: Element | null = document.activeElement): Element | null {
	if (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) {
		return traverseActiveElements(activeElement.shadowRoot.activeElement);
	}

	return activeElement;
}

/**
 * Returns the assigned elements to the first matching slot of the shadow root.
 * @param root
 */
export function getSlottedElements(root: ShadowRoot): Element[] {
	return <Element[]>Array.from(root.querySelector("slot")!.assignedNodes()).filter(node => node.nodeName !== `#text`);
}

/**
 * Remove all children from a container.
 * @param $container
 */
export function removeChildren($container: HTMLElement) {
	while ($container.firstChild) {
		(<HTMLElement>$container.firstChild).remove();
	}
}

/**
 * Sanitizes dangerous HTML.
 * @param html
 */
export function sanitize(html: string): string {
	return html
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/'/g, "&#039;")
		.replace(/"/g, "&quot;");
}

/**
 * Determines whether the element is hidden in the DOM.
 * https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
 * @param $elem
 * @param style
 */
export function isHidden($elem: HTMLElement, style?: CSSStyleDeclaration) {
	// A more precise (AND MUCH SLOWER) check
	if (style != null) {
		return style.display === "none";
	}

	// If the element is hidden the offset parent will be null.
	return $elem.offsetParent === null;
}

/**
 * Sets a css property on an element.
 * @param name
 * @param value
 * @param $target
 */
export function setProperty(name: string, value: string, $target: HTMLElement = document.documentElement) {
	$target.style.setProperty(name, value);
}

/**
 * Removes a css property on an element.
 * @param name
 * @param $target
 */
export function removeProperty(name: string, $target: HTMLElement = document.documentElement) {
	$target.style.removeProperty(name);
}
