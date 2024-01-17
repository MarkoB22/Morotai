/**
 *  @class
 *  @function Cart
 */
class Cart {

  constructor() {
    this.container = document.getElementById('Cart');
		this.setupEventListeners();
  }
  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value);
  }
	setupEventListeners() {
		let removes = this.container.querySelectorAll('.remove');


		removes.forEach((remove) => {
			remove.addEventListener('click', (event) => {

				this.updateQuantity(event.target.dataset.index, '0');

				event.preventDefault();
			});
		});

		this.debouncedOnChange = debounce((event) => {
			this.onChange(event);
		}, 300);

		this.container.addEventListener('change', this.debouncedOnChange.bind(this));
  }
  getSectionsToRender() {
    return [{
      id: 'Cart',
      section: 'main-cart',
      selector: '.thb-cart-form'
    },
    {
      id: 'cart-drawer-toggle',
      section: 'cart-bubble',
      selector: '.thb-item-count'
    }];
  }
  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }
  updateQuantity(line, quantity) {

		this.container.classList.add('cart-disabled');
		if ( line ) {
			this.container.querySelector(`#CartItem-${line}`).classList.add('loading');
		}

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });
		dispatchCustomEvent('line-item:change:start', {
			quantity: quantity
		});
    fetch(`${theme.routes.cart_change_url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': `application/json`
        },
        ...{
          body
        }
      })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

				this.renderContents(parsedState, line);

				this.container.classList.remove('cart-disabled');

				dispatchCustomEvent('line-item:change:end', {
					quantity: quantity,
					cart: parsedState
				});
      });
  }
	renderContents(parsedState, line) {
		this.getSectionsToRender().forEach((section => {
			const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

			elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

			let removes = this.container.querySelectorAll('.remove');

			if (removes) {
				removes.forEach((remove) => {
					remove.addEventListener('click', (event) => {

						this.updateQuantity(event.target.dataset.index, '0');

						event.preventDefault();
					});
				});
			}
			if ( line && this.container.querySelector(`#CartItem-${line}`) ) {
				this.container.querySelector(`#CartItem-${line}`).classList.remove('loading');
			}
		}));
	}
}
window.addEventListener('load', () => {
  if (typeof Cart !== 'undefined') {
    new Cart();
  }
});
