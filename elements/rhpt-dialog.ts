import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ComposedEvent } from '@patternfly/pfe-core';
import { bound, observed } from '@patternfly/pfe-core/decorators.js';
import '@rhds/elements/rh-dialog/rh-dialog.js';

interface RhDialog extends HTMLElement {
  open: boolean
}

export class DialogToggleEvent extends ComposedEvent {
  constructor(
    /** Current open state of the dialog  */
    public open: RhDialog['open']
  ) {
    super('dialog-toggle', {
      bubbles: true,
      composed: true,
    });
  }
}

@customElement('rhpt-dialog')
export class RhptDialog extends LitElement {
  static readonly shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @observed
  @property()
  trigger?: string;

  #activeTrigger?: HTMLElement;
  #triggerRefs = new WeakMap<Element, undefined>();

  #rhDialog?: RhDialog;
  #mo = new MutationObserver(this.onDialogMutation);

  protected firstUpdated(): void {
    this.#rhDialog = this.shadowRoot?.querySelector('rh-dialog') ?? undefined;
    if (this.#rhDialog) {
      this.#mo.observe(this.#rhDialog, { attributes: true });
    }
  }

  public toggle() {
    if (!this.#rhDialog) return;
    // open the dialog
    this.#rhDialog.open = true;
    this.dispatchEvent(new DialogToggleEvent(this.#rhDialog.open));
  }

  render() {
    return html`
      <rh-dialog>
        <slot name="header" slot="header"></slot>
        <slot></slot>
        <slot name="footer" slot="footer"></slot>
      </rh-dialog>
    `;
  }

  /** Set up click handlers for all triggers */
  protected _triggerChanged() {
    if (!this.trigger) return;
    [...document.querySelectorAll(this.trigger)].forEach(el => {
      // if the trigger is not in the WeakMap then apply
      // the click handler and add it to the WeakMap
      if (!this.#triggerRefs.has(el)) {
        // @ts-ignore
        el.addEventListener('click', this.onTriggerClick);
        // @ts-ignore
        el.addEventListener('keydown', this.onTriggerKeydown);
        this.#triggerRefs.set(el, undefined);
      }
    })
  }

  /**
   * When the open attr changes to closed on rh-dialog
   * then return the focus to the trigger.
   */
  @bound
  private onDialogMutation(e: Array<MutationRecord>) {
    for (const mut of e) {
      if (mut.attributeName === 'open') {
        if (this.#rhDialog?.open !== undefined) {
          if (this.#rhDialog?.open === false) {
            this.#activeTrigger?.focus?.();
            this.#activeTrigger = undefined;
          }
          this.dispatchEvent(new DialogToggleEvent(this.#rhDialog.open));
        }
      }
    }
  }

  @bound
  private async onTriggerClick(event: PointerEvent) {
    event.preventDefault();
    this.toggle();
  }

  @bound
  private async onTriggerKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    this.toggle();
    await this.updateComplete;
    // give the dialog focus
    this.focus();
    if (event.target) {
      // remember what trigger initiated the
      // dialog so we can return focus to it later.
      this.#activeTrigger = event.target as HTMLElement;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rhpt-dialog': RhptDialog;
  }
}
