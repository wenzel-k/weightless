import { html, property, TemplateResult } from "lit-element";
import { ifDefined } from "lit-html/directives/if-defined";
import { Ripple } from "../../ripple/ripple";
import { ENTER, SPACE } from "../../util/constant/keycode";
import { cssResult } from "../../util/css";
import { addListener, stopEvent } from "../../util/event";
import { FormElementBehavior, IFormElementBehaviorProperties } from "../form-element";

import styles from "./button-behavior.scss";

/**
 * Properties of the button behavior.
 */
export interface IButtonBehaviorProperties extends IFormElementBehaviorProperties {
	type: "button" | "submit" | "reset";
}

/**
 * Provides button behavior.
 */
export abstract class ButtonBehavior extends FormElementBehavior implements IButtonBehaviorProperties {
	static styles = [...FormElementBehavior.styles, cssResult(styles)];

	/**
	 * Type of the button.
	 * @attr
	 */
	@property({ type: String }) type: "button" | "submit" | "reset" = "submit";

	/**
	 * Ripple element.
	 */
	protected abstract get $ripple(): Ripple | null;

	/**
	 * Hooks up the component.
	 */
	connectedCallback() {
		super.connectedCallback();

		this.listeners.push(addListener(this, "click", this.onClick.bind(this)), addListener(this, "keydown", this.onKeyDown.bind(this)));
	}

	/**
	 * Handles the key down event.
	 * @param e
	 */
	protected onKeyDown(e: Event) {
		if (e instanceof KeyboardEvent && (e.code === ENTER || e.code === SPACE)) {
			// We want to have a position sent through the simulated click
			// (document.elementFromPoint(left, top) as HTMLElement).click();

			this.click();
			stopEvent(e);

			// Show ripple if one has been defined
			if (this.$ripple != null) {
				this.$ripple.spawnRipple(undefined, { autoRelease: true });
			}
		}
	}

	/**
	 * Handles click events on the button.
	 * @param e
	 */
	protected onClick(e: Event) {
		// If disabled we stop the event here
		if (this.disabled) {
			stopEvent(e);
			return;
		}

		// Re-fire the event on the inner form element to interact with the form if there is one
		if (e.target == this && !e.defaultPrevented) {
			this.$formElement.dispatchEvent(new MouseEvent("click", { relatedTarget: this, composed: true }));
		}
	}

	/**
	 * Returns the form element
	 */
	protected renderFormElement(): TemplateResult {
		return html`
			<button
				style="display: none;"
				id="${this.formElementId}"
				aria-hidden="true"
				tabindex="-1"
				type="${this.type}"
				?disabled="${this.disabled}"
				name="${ifDefined(this.name)}"
				value="${ifDefined(this.value)}"
			></button>
		`;
	}
}
