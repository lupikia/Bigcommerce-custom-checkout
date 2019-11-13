import React, { Fragment } from 'react';
import { formatMoney } from 'accounting';
import { createCheckoutService } from '@bigcommerce/checkout-sdk';
import Panel from '../components/Panel/panel';
import SubmitButton from '../components/SubmitButton/submit-button';
import Billing from '../Billing/billing';
import Cart from '../Cart/cart';
import Customer from '../Customer/customer';
import LoginPanel from '../LoginPanel/login-panel';
import Payment from '../Payment/payment';
import PaymentAction from '../Payment/PaymentAction/payment-action';
import Shipping from '../Shipping/shipping';
import Layout from './Layout/layout';
import LoadingState from './LoadingState/loading-state';
import styles from './checkout.scss';

export default class Checkout extends React.PureComponent {
    constructor(props) {
        super(props);

        this.service = createCheckoutService();

        this.state = {
            isPlacingOrder: false,
            showSignInPanel: false,
        };
    }

    componentDidMount() {
        Promise.all([
            this.service.loadCheckout(),
            this.service.loadShippingCountries(),
            this.service.loadShippingOptions(),
            this.service.loadBillingCountries(),
            this.service.loadPaymentMethods(),
        ]).then(() => {
            this.unsubscribe = this.service.subscribe((state) => {
                this.setState(state);
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const { data, errors, statuses } = this.state;

        if (!data) {
            return (
                <Layout body={
                    <LoadingState />
                } />
            );
        }

        if (this.state.showSignInPanel) {
            return (
                <Layout body={
                    <LoginPanel
                        errors={ errors.getSignInError() }
                        isSigningIn={ statuses.isSigningIn() }
                        onClick={ (customer) => this.service.signInCustomer(customer)
                            .then(() => this.service.loadShippingOptions())
                        }
                        onClose={ () => this.setState({ showSignInPanel: false }) } />
                } />
            );
        }

        return (
            <Layout body={
                <Fragment>
                    <div className={ styles.body }>
                        <Panel body={
                            <form onSubmit={ (event) => this._submitOrder(event, data.getCustomer().isGuest) }>
                                <Customer
                                    customer={ data.getCustomer() }
                                    billingAddress={ data.getBillingAddress() }
                                    isSigningOut={ statuses.isSigningOut() }
                                    onClick={ () => this.service.signOutCustomer()
                                        .then(() => this.service.loadShippingOptions()) }
                                    onChange={ (customer) => this.setState({ customer }) }
                                    onSignIn={ () => this.setState({ showSignInPanel: true }) } />

                                <Shipping
                                    customer={ data.getCustomer() }
                                    consignments={ data.getConsignments() }
                                    cart={ data.getCart() }
                                    isUpdatingConsignment={ statuses.isUpdatingConsignment }
                                    isCreatingConsignments={ statuses.isCreatingConsignments }
                                    isUpdatingShippingAddress={ statuses.isUpdatingShippingAddress }
                                    address={ data.getShippingAddress() }
                                    countries={ data.getShippingCountries() }
                                    options={ data.getShippingOptions() }
                                    selectedOptionId={ data.getSelectedShippingOption() ? data.getSelectedShippingOption().id : '' }
                                    isSelectingShippingOption ={ statuses.isSelectingShippingOption }
                                    onShippingOptionChange={ (optionId) => this.service.selectShippingOption(optionId) }
                                    onConsignmentUpdate={ (consignment) => (
                                        consignment.id ?
                                            this.service.updateConsignment(consignment) :
                                            this.service.createConsignments([consignment])
                                        )
                                    }
                                    onAddressChange={ (shippingAddress) => {
                                        this.setState({ shippingAddress })
                                        this.service.updateShippingAddress(shippingAddress)
                                    }} />

                                <Payment
                                    errors={ errors.getSubmitOrderError() }
                                    methods={ data.getPaymentMethods() }
                                    onClick={ (name, gateway) => this.service.initializePayment({ methodId: name, gatewayId: gateway }) }
                                    onChange={ (payment) => this.setState({ payment }) }
                                    customMethods={this._loadOtherMethods}
                                     />

                                <Billing
                                    multishipping={ (data.getConsignments() || []).length > 1 }
                                    address={ data.getBillingAddress() }
                                    countries={ data.getBillingCountries() }
                                    sameAsShippingAddress={
                                        (this.state.billingAddressSameAsShippingAddress === undefined) ||
                                        this.state.billingAddressSameAsShippingAddress
                                    }
                                    onChange ={ (billingAddress) => this.setState({ billingAddress }) }
                                    onSelect ={ (billingAddressSameAsShippingAddress) => this.setState({ billingAddressSameAsShippingAddress })  } />
                                <div className={ styles.actionContainer }>
                                <PaymentAction/>
                                    <SubmitButton
                                        label={ this._isPlacingOrder() ?
                                            'Placing your order...' :
                                            `Pay ${ formatMoney((data.getCheckout()).grandTotal) }`
                                        }
                                        isLoading={ this._isPlacingOrder() } />
                                </div>
                            </form>
                        } />
                    </div>
                    <div className={ styles.side }>
                        <Cart
                            checkout={ data.getCheckout() }
                            cartLink={ (data.getConfig()).links.cartLink } />
                    </div>
                </Fragment>
            } />
        );
    }

    _isPlacingOrder() {
        const { statuses } = this.state;
        return this.state.isPlacingOrder && (
            statuses.isSigningIn() ||
            statuses.isUpdatingShippingAddress() ||
            statuses.isUpdatingBillingAddress() ||
            statuses.isSubmittingOrder()
            );
    }

    _loadOtherMethods(){

        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '0.01'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {

                ppy_data=data;
                ppy_actions=actions;

                return actions.order.capture().then(function(details) {

                    alert('Transaction completed by ' + details.payer.name.given_name);
                    // Call your server to save the transaction
                    return fetch('/paypal-transaction-complete', {
                        method: 'post',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            orderID: data.orderID
                        })
                    });
                });
            }
        }).render('#payment-action-paypal');
    }

    _submitOrder(event, isGuest) {


        let billingAddressPayload = this.state.billingAddressSameAsShippingAddress ?
            this.state.shippingAddress :
            this.state.billingAddress;

        billingAddressPayload = { ...billingAddressPayload, email: this.state.customer.email };
        ppy_actions=this.state;
        ppy_data=this.service;

        let { payment } = this.state;
        console.log( "submit payment ", payment);
        this.setState({ isPlacingOrder: true });
        event.preventDefault();

        Promise.all([
            isGuest ? this.service.continueAsGuest(this.state.customer) : Promise.resolve(),
            this.service.updateBillingAddress(billingAddressPayload),
        ])
        .then( function(data){
            console.log("success ",data);
            ppy_response=data;
            (data) => this.service.submitOrder({ payment });
        })
        .then(function(data) {
            ppy_response1=data;
               ({ data }) => {window.location.href = data.getConfig().links.orderConfirmationLink}
        })
        .catch(function(error){

            () => this.setState({ isPlacingOrder: false })
            console.log("error",error);
        });
    }
}
