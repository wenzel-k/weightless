import { customElement, html, LitElement, property } from "lit-element";
import { TemplateResult } from "lit-html";
import { sharedStyles } from "../style/shared";
import { cssResult } from "../util/css";
import { renderAttributes } from "../util/dom";

import styles from "./title-element.scss";

export interface ITitleElementProperties {
	level: number;
	role: string;
}

@customElement("title-element")
export class TitleElement extends LitElement implements ITitleElementProperties {
	static styles = [sharedStyles, cssResult(styles)];

	@property({type: Number, reflect: true}) level = 1;
	@property({type: String, reflect: true}) role = "heading";

	/**
	 * Reflect the updates when properties change.
	 * @param props
	 */
	protected updated (props: Map<keyof ITitleElementProperties, unknown>) {
		super.updated(props);

		// Update the aria attributes
		if (props.has("level")) {
			renderAttributes(this, {
				"aria-level": this.level
			});
		}
	}

	/**
	 * Returns the template for the component.
	 */
	protected render (): TemplateResult {
		return html`
			<slot></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"title-element": TitleElement;
	}
}