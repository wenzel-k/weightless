import { customElement, html, svg, TemplateResult } from "lit-element";
import { IProgressBehaviorProperties, ProgressBehavior, ProgressMode } from "../behavior/progress/progress-behavior";
import { cssResult } from "../util/css";

import styles from "./progress-spinner.scss";

/**
 * Properties of the progress spinner.
 */
export interface IProgressSpinnerProperties extends IProgressBehaviorProperties {}

/**
 * Base dash array length of the SVG circle.
 */
const DASH_ARRAY = 285;

/**
 * Fills a circle from 0% to 100%.
 * @cssprop --progress-spinner-size - Width and height
 * @cssprop --progress-spinner-color - Color
 * @cssprop --progress-spinner-buffer-color - Color of the buffer
 * @cssprop --progress-spinner-stroke-width - Width of the spinner stroke
 * @cssprop --progress-spinner-determinate-progress-transition - Transition of the spinner when determinate
 * @cssprop --progress-spinner-indeterminate-container-duration - Duration of the indeterminate animation for the container
 * @cssprop --progress-spinner-indeterminate-progress-duration - Duration of the indeterminate animation for the spinner
 * @cssprop --progress-spinner-indeterminate-timing-function - Timing function of the indeterminate animation
 */
@customElement("wl-progress-spinner")
export class ProgressSpinner extends ProgressBehavior implements IProgressSpinnerProperties {
	static styles = [...ProgressBehavior.styles, cssResult(styles)];

	/**
	 * Returns the template for the element.
	 */
	protected render(): TemplateResult {
		return html`
			<svg focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
				${this.bufferPerc > 0
					? svg`<circle id="buffer" cx="50%" cy="50%" r="45" fill="transparent" style="stroke-dashoffset: ${DASH_ARRAY -
							DASH_ARRAY * this.bufferPerc}px"></circle>`
					: ""}
				<circle
					id="progress"
					cx="50%"
					cy="50%"
					r="45"
					fill="transparent"
					style="${this.mode === ProgressMode.DETERMINATE ? `stroke-dashoffset: ${DASH_ARRAY - DASH_ARRAY * this.progressPerc}px;` : ""}"
				></circle>
			</svg>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"wl-progress-spinner": ProgressSpinner;
	}
}
