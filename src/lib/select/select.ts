import { customElement, html, property, TemplateResult } from "lit-element";
import { ifDefined } from "lit-html/directives/if-defined";
import { IInputBehaviorProperties, InputBehavior } from "../behavior/input/input-behavior";
import { AriaRole } from "../util/aria";
import { cssResult } from "../util/css";
import { removeChildren } from "../util/dom";
import { addListener } from "../util/event";
import styles from "./select.scss";

/**
 * Properties of the select.
 */
export interface ISelectProperties extends IInputBehaviorProperties {}

/**
 * Select one or more values from a set of options.
 * @slot - <option> elements go here.
 * @cssprop --select-arrow-height - Height of the arrow.
 */
@customElement("wl-select")
export class Select extends InputBehavior implements ISelectProperties {
	static styles = [...InputBehavior.styles, cssResult(styles)];

	/**
	 * Role of the select.
	 */
	@property({ type: String, reflect: true }) role: AriaRole = "select";

	/**
	 * Hook up the slot change event listener after first update.
	 * @param props
	 */
	firstUpdated(props: Map<keyof ISelectProperties, unknown>) {
		super.firstUpdated(<Map<keyof IInputBehaviorProperties, unknown>>props);
		this.listeners.push(addListener(this.$slot, "slotchange", this.updateOptions.bind(this), { passive: true }));

		this.updateOptions();
	}

	/**
	 * Updates the options of the select element and syncs the value.
	 * Note that it was not possible to use the slot directly in the select (eg. <select><slot></slot></select>)
	 * and that the options from the slot had to be cloned in order to not be removed from the slot.
	 */
	private updateOptions() {
		if (this.$formElement == null) return;
		const $select = <HTMLSelectElement>this.$formElement;
		const nodes = <Element[]>this.$slot.assignedNodes().filter(node => node.nodeType === 1);

		// Grab the options from the slot and clone them. This prevents the nodes being removed
		// from the slot when adding it to the set of options in the select.
		const slotOptions = <HTMLOptionElement[]>nodes.filter(node => (node.tagName || "").toLowerCase() === "option").map(node => node.cloneNode(true));
		if (slotOptions.length === 0) return;

		const valueBeforeUpdate = $select.value;

		// Remove existing options
		removeChildren($select);

		// Add the new options and find the one which is selected
		for (const node of slotOptions) {
			$select.options.add(node);
		}

		// Find the new value. If the value before was not selected, use either the
		// initial value set before the form element was present or the selected value from the set of options.
		// The initial value is important because if we simply relied on the native select to give us the correct
		// value we would get an empty string because the native behavior is to return an empty string if trying
		// to set a value with no corresponding options which will be the case if set initially before any
		// options has been added.
		const newValue = valueBeforeUpdate === "" ? this.initialValue || this.value : valueBeforeUpdate;

		// Keep the select in sync
		if ($select.value !== newValue) {
			$select.value = newValue;
		}

		// Keep the value in sync and notify the listeners
		if (this.value !== newValue) {
			this.value = newValue;
		}
	}

	/**
	 * Returns the form element
	 */
	protected renderFormElement(): TemplateResult {
		return html`
			<select
				id="${this.formElementId}"
				.value="${this.value}"
				?required="${this.required}"
				?disabled="${this.disabled}"
				?readonly="${this.readonly}"
				name="${ifDefined(this.name)}"
				autocomplete="${ifDefined(this.autocomplete)}"
				tabindex="${this.disabled ? -1 : 0}"
			></select>
			<svg id="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 25" preserveAspectRatio="none">
				<polygon points="0,0 50,0 25,25" />
			</svg>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"wl-select": Select;
	}
}
