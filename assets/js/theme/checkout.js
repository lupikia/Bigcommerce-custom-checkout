import PageManager from './page-manager';
import { createCheckoutService } from '@bigcommerce/checkout-sdk';

const service = createCheckoutService();

export default class Checkout extends PageManager {


    constructor(context) {
        super(context);

        this.pepe = "lol";
        return this;
    }

    async onReady() {
        const state = await service.loadCheckout();
        console.log(state.data.getCheckout());
    }
}