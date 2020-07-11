import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import "../divider";
import { sharedStyles } from "../style/shared";
import { AriaRole } from "../util/aria";
import { cssResult } from "../util/css";

import styles from "./banner.scss";

/**
 * Properties of the banner.
 */
export interface IBannerProperties {
	role: AriaRole;
}

/**
 * Display a non-interruptive message and related optional actions.
 * @slot icon - Icon content.
 * @slot action - Action content (you can have multiple slots named action).
 * @slot - Default content.
 * @cssprop --banner-icon-margin - Margin of the icon slot
 * @cssprop --banner-padding - Padding
 * @cssprop --banner-content-padding - Padding of the content slot
 * @cssprop --banner-icon-color - Color of the icon
 * @cssprop --banner-color - Color
 * @cssprop --banner-bg - Background
 */
@customElement("wl-banner")
export class Banner extends LitElement implements IBannerProperties {
	static styles = [sharedStyles, cssResult(styles)];

	/**
	 * Role of the banner.
	 * @attr
	 */
	@property({ type: String, reflect: true }) role: AriaRole = "banner";

	/**
	 * Returns the template of the element.
	 */
	protected render(): TemplateResult {
		return html`
			<div id="content">
				<slot name="icon"></slot>
				<slot></slot>
			</div>
			<div id="actions">
				<slot name="action"></slot>
			</div>
			<wl-divider id="divider"></wl-divider>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"wl-banner": Banner;
	}
}
