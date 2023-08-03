import { html, LitElement, type PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import "@rhds/elements/rh-cta/rh-cta.js";

@customElement('rhpt-link')
export class RhptLink extends LitElement {

  @property()
  icon?: string;

  @property()
  set?: string;

  firstUpdated() {
    this.#setUpdated();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('set')) {
      this.#setUpdated;
    }
  }

  #setUpdated() {
    customElements.whenDefined('rh-cta')
      .then(async () => {
        await this.updateComplete;
        const icon = this.shadowRoot?.querySelector('rh-cta')?.shadowRoot?.querySelector('pf-icon');
        if (this.set) icon?.setAttribute('set', this.set);
      });
  }

  render() {
    return html`
      <rh-cta icon=${ifDefined(this.icon)}>
        <slot></slot>
      </rh-cta>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rhpt-link': RhptLink;
  }
}
