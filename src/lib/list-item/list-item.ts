import { customElement, html, property, query, TemplateResult } from "lit-element";
import { ButtonBehavior } from "../behavior/button/button-behavior";
import "../ripple";
import { Ripple } from "../ripple/ripple";
import { AriaRole } from "../util/aria";
import { cssResult } from "../util/css";
import { IRowing, row } from "../util/rowing";

import styles from "./list-item.scss";

/**
 * Properties of the list item.
 */
export interface IListItemProperties {
	role: AriaRole;
	noRipple: boolean;
	clickable: boolean;
}

/**
 * Display an item in a list.
 * @slot before - Left content.
 * @slot - Default content.
 * @slot after - Right content.
 * @cssprop --list-item-border-radius - Border radius
 * @cssprop --list-item-transition - Transition
 * @cssprop --list-item-padding - Padding
 * @cssprop --list-item-before-align-self - Alignment of the before slot
 * @cssprop --list-item-before-margin - Margin of the before slot
 * @cssprop --list-item-after-align-self - Alignment of the after slot
 * @cssprop --list-item-after-margin - Margin of the after slot
 * @cssprop --list-item-color - Default color
 * @cssprop --list-item-bg - Default background
 * @cssprop --list-item-color-active - Color when active
 * @cssprop --list-item-bg-active - Background when active
 * @cssprop --list-item-color-hover - Color when hover
 * @cssprop --list-item-bg-hover - Background when hover
 * @cssprop --list-item-color-active-hover - Color when active and hover
 * @cssprop --list-item-bg-active-hover - Background when active and hover
 * @cssprop --list-item-color-disabled - Color when disabled
 * @cssprop --list-item-bg-disabled - Background when disabled
 * @cssprop --list-item-opacity-disabled - Opacity when disabled
 */
@customElement("wl-list-item")
export class ListItem extends ButtonBehavior implements IListItemProperties, IRowing<ListItem> {
	static styles = [...ButtonBehavior.styles, cssResult(styles)];

	/**
	 * Disables the element.
	 * @attr
	 */
	@property({ type: Boolean, reflect: true }) disabled: boolean = false;

	/**
	 * Makes the element clickable.
	 * @attr
	 */
	@property({ type: Boolean, reflect: true }) clickable: boolean = false;

	/**
	 * Deactivates the ripple.
	 * @attr
	 */
	@property({ type: Boolean, reflect: true }) noRipple: boolean = false;

	/**
	 * Role of the list item.
	 * @attr
	 */
	@property({ type: String, reflect: true }) role: AriaRole = "listitem";

	/**
	 * Ripple element.
	 */
	@query("#ripple") protected $ripple!: Ripple;

	/**
	 * Query the group.
	 */
	queryGroup(): ListItem[] {
		return Array.from(this.parentElement!.querySelectorAll(`${this.nodeName.toLowerCase()}:not([disabled])`));
	}

	/**
	 * Focuses a grouped element.
	 * @param elem
	 */
	rowToElement(elem: ListItem) {
		elem.focus();
	}

	/**
	 * Handles the key up event.
	 * Adds support for rowing tabindex.
	 * @param e
	 */
	protected onKeyDown(e: KeyboardEvent) {
		super.onKeyDown(e);
		row(this, e);
	}

	/**
	 * Returns the template of the element.
	 */
	protected render(): TemplateResult {
		return html`
			<slot name="before"></slot>
			<div id="content">
				<slot></slot>
			</div>
			<slot name="after"></slot>
			<wl-ripple id="ripple" overlay .target="${this}" ?disabled="${this.disabled || !this.clickable || this.noRipple}"></wl-ripple>
			${this.renderFormElement()}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"wl-list-item": ListItem;
	}
}
