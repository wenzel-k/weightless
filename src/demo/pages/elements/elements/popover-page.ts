import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import "../../../../lib/button/button";
import "../../../../lib/card/card";
import "../../../../lib/list-item/list-item";
import "../../../../lib/popover-card";
import { defaultPopoverConfig, IPopoverBaseProperties, IPopoverConfig, Popover } from "../../../../lib/popover/popover";
import { showPopover, showPopoverAtPosition } from "../../../../lib/popover/show-popover";
import "../../../../lib/select/select";
import "../../../../lib/textarea/textarea";
import "../../../../lib/title/title";
import { cssResult } from "../../../../lib/util/css";
import { OriginX, OriginY } from "../../../../lib/util/position";
import "../../../elements/code-example/code-example-element";
import "../../../elements/demo/demo-element";
import { getMainScrollContainer } from "../../../main-scroll-target";
import { sharedStyles } from "../../../style/shared";

async function openTemplatePopover(target: Element, text: string, config: Partial<IPopoverBaseProperties> = {}) {
	const ref = await showPopover({
		fixed: true,
		blockScrolling: true,
		container: document.body,
		template: html`
			<wl-popover-card><p>${text}</p></wl-popover-card>
		`,
		scrollContainer: getMainScrollContainer(),
		anchor: target,
		...config
	});

	console.log(await ref.result);
}

function originToFlex(origin: OriginY | OriginX): string {
	switch (origin) {
		case OriginY.TOP:
		case OriginX.LEFT:
			return "flex-start";
		case OriginY.CENTER:
		case OriginX.CENTER:
			return "center";
		case OriginY.BOTTOM:
		case OriginX.RIGHT:
			return "flex-end";
	}

	throw new Error("Wrong input");
}

function showContextMenu(e: MouseEvent, template: TemplateResult, config: Partial<IPopoverConfig> = {}) {
	e.preventDefault();
	return showPopoverAtPosition({
		fixed: true,
		container: document.documentElement,
		template,
		position: {
			left: e.clientX,
			top: e.clientY
		},
		...config
	});
}

@customElement("popover-page")
export default class PopoverPage extends LitElement {
	static styles = [
		sharedStyles,
		cssResult(`
		#selector {
			display: flex;
			align-items: center;
			margin: 0 0 12px;
		}
		
		wl-select {
			width: 100%;
		}
		
		wl-select:not(:last-child) {
			margin: 0 12px 0 0;
		}
		
		
		.anchor-container {
			position: relative;
            margin: 0 auto;
            padding: 8px;
		}
		
		.anchor-area {
			display: inline-flex;
		    z-index: 1;
		    pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		
		.anchor-dot {
			border-radius: 100%;
			width: 16px;
			height: 16px;
			background: green;
		}
		
		#toucharea {
			width: 100%;
			height: 300px;
			background: lightgrey;
		}
		
		#popover wl-card {
		    max-height: calc(var(--popover-container-max-height) - 90px);
            min-height: 90px;
            overflow: auto;
		}
		
	`)
	];

	@property({ type: String }) transformOriginX = defaultPopoverConfig.transformOriginX!;
	@property({ type: String }) transformOriginY = defaultPopoverConfig.transformOriginY!;
	@property({ type: String }) anchorOriginX = defaultPopoverConfig.anchorOriginX!;
	@property({ type: String }) anchorOriginY = defaultPopoverConfig.anchorOriginY!;

	/**
	 * Opens the declarative popover.
	 */
	private async openDeclarativePopover() {
		const $popover = this.shadowRoot!.querySelector<Popover<string>>("#popover")!;
		const res = await $popover.show();
		console.log("Result:", res);
	}

	private async showContextMenu(e: MouseEvent) {
		e.preventDefault();

		let overlay: Popover;

		async function showSubContextMenu(e: MouseEvent) {
			overlay.persistent = true;
			const res = await showContextMenu(
				e,
				html`
					<wl-popover-card style="--list-item-border-radius: 0">
						<wl-list-item clickable>Cats</wl-list-item>
						<wl-list-item clickable>Dogs</wl-list-item>
					</wl-popover-card>
				`,
				{
					closeOnClick: true
				}
			);

			await res.result;
			overlay.persistent = false;
		}

		const res = await showContextMenu(
			e,
			html`
				<wl-popover-card style="--list-item-border-radius: 0">
					<wl-list-item clickable @click="${() => overlay.hide("Edit")}">Edit</wl-list-item>
					<wl-list-item clickable @click="${() => overlay.hide("Save")}">Save</wl-list-item>
					<wl-list-item clickable @click="${(e: MouseEvent) => showSubContextMenu(e)}">More..</wl-list-item>
				</wl-popover-card>
			`
		);

		overlay = res.overlay;
	}

	protected render() {
		return html`
			<demo-element default>
				<code-example-element>
					<wl-popover open>
						<wl-popover-card>
							<p>This is a popover!</p>
						</wl-popover-card>
					</wl-popover>
				</code-example-element>
			</demo-element>

			<wl-title level="3">Open popover already in the DOM (declarative)</wl-title>
			<demo-element>
				<code-example-element headline='this.shadowRoot.querySelector("#popover").show().then(result => console.log(result));'>
					<wl-button id="open-popover" @click="${() => this.openDeclarativePopover()}">Open popover 1</wl-button>
					<wl-popover id="popover" anchor="#open-popover" .anchorOpenEvents="${["click"]}" fixed .scrollContainer="${getMainScrollContainer()}">
						<wl-card
							><wl-textarea></wl-textarea>
							<p>Hello world!</p></wl-card
						>
					</wl-popover>
				</code-example-element>
			</demo-element>

			<wl-title level="3">Auto open popovers anchored to an element</wl-title>
			<demo-element>
				<code-example-element headline='<wl-popover anchor="#auto-open-button" .anchorOpenEvents="\${["mouseover"]}" fixed>...'>
					<wl-button id="auto-open-button">Hover me!</wl-button>
					<wl-popover
						anchor="#auto-open-button"
						.anchorOpenEvents="${["mouseover"]}"
						.scrollContainer="${getMainScrollContainer()}"
						fixed
						disableFocusTrap
						anchorOriginX="center"
						anchorOriginY="center"
						transformOriginX="center"
					>
						<wl-popover-card>I auto opened!</wl-popover-card>
					</wl-popover>
				</code-example-element>
			</demo-element>

			<wl-title level="3">Open popover from template (imperative)</wl-title>
			<demo-element>
				<div id="selector">
					<wl-select
						outlined
						label="Anchor Origin X"
						value="${this.anchorOriginX}"
						@change="${(e: Event) => (this.anchorOriginX = <OriginX>(<HTMLSelectElement>e.target).value)}"
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</wl-select>
					<wl-select
						outlined
						label="Anchor Origin Y"
						value="${this.anchorOriginY}"
						@change="${(e: Event) => (this.anchorOriginY = <OriginY>(<HTMLSelectElement>e.target).value)}"
					>
						<option value="top">Top</option>
						<option value="center">Center</option>
						<option value="bottom">Bottom</option>
					</wl-select>
					<wl-select
						outlined
						label="Transform Origin X"
						value="${this.transformOriginX}"
						@change="${(e: Event) => (this.transformOriginX = <OriginX>(<HTMLSelectElement>e.target).value)}"
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</wl-select>
					<wl-select
						outlined
						label="Transform Origin Y"
						value="${this.transformOriginY}"
						@change="${(e: Event) => (this.transformOriginY = <OriginY>(<HTMLSelectElement>e.target).value)}"
					>
						<option value="top">Top</option>
						<option value="center">Center</option>
						<option value="bottom">Bottom</option>
					</wl-select>
				</div>
				<div class="anchor-container">
					<div class="anchor-area" style="align-items: ${originToFlex(this.anchorOriginY)}; justify-content: ${originToFlex(this.anchorOriginX!)}">
						<div class="anchor-dot"></div>
					</div>
					<wl-button
						id="open-popover-2"
						@click="${() =>
							openTemplatePopover(this.shadowRoot!.querySelector("#open-popover-2")!, "This is a template!", {
								transformOriginX: this.transformOriginX,
								transformOriginY: this.transformOriginY,
								anchorOriginX: this.anchorOriginX,
								anchorOriginY: this.anchorOriginY
							})}"
						>Open</wl-button
					>
				</div>
				<highlight-element language="html" text="${`<wl-button id="open-popover-2">Open</wl-button>`}"></highlight-element>
				<highlight-element
					language="javascript"
					text="${`
					const ref = await openPopover({
						fixed: true,
						blockScrolling: true,
						container: document.body,
						transformOriginX: "${this.transformOriginX}",
						transformOriginY: "${this.transformOriginY}",
						anchorOriginX: "${this.anchorOriginX}",
						anchorOriginY: "${this.anchorOriginY}",
						anchor: this.shadowRoot.querySelector("#open-popover-2"),
						template: html\`<wl-popover-card><p>This is a template!</p></wl-popover-card>\`
					});
				`}"
				></highlight-element>
			</demo-element>

			<wl-title level="3">Nested popovers</wl-title>
			<demo-element>
				<p>Right-click on the grey area below.</p>
				<div id="toucharea" @contextmenu="${this.showContextMenu}"></div>
			</demo-element>
		`;
	}
}
