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
        ppy_state=this.state;
        ppy_service=this.service;

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
                            <form onSubmit={ (event) => this._loadOtherMethods(event, data.getCustomer().isGuest) }>
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

        ppy_state=this.state;
        ppy_service=this.service;

        return this.state.isPlacingOrder && (
            statuses.isSigningIn() ||
            statuses.isUpdatingShippingAddress() ||
            statuses.isUpdatingBillingAddress() ||
            statuses.isSubmittingOrder()
            );
    }

    _loadOtherMethods(event, isGuest)
    {

        event.preventDefault();
        var internal = this;
        //clear method area
        $("#payment-action-paypal").html("");
        var temp_cart = this.state.data.getCart();

        if(this.state.payment.methodId=="PayPal"){
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: temp_cart.cartAmount
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {

                        internal._submitOrder(isGuest,details,function(sucess){

                            if(sucess.status)
                            {
                                //success redirect

                            }else{
                                //error message
                            }
                        });
                    });
                }
            }).render('#payment-action-paypal');
        }else{

            internal._submitOrder(isGuest,[],function(sucess){

                if(sucess.status)
                {
                    //success redirect


                }else{
                    //error message
                }
            });
        }
    }

    _submitOrder(isGuest,details,callback ) {

        this.setState({ isPlacingOrder: true });
        var checkout = this.state.data.getCart();
        var products =[];
        checkout.lineItems.physicalItems.forEach(function(item){

            var temp_data =[
                {
                    "name": item.name,
                    "quantity": item.quantity,
                    "price_inc_tax": item.extendedListPrice,
                    "price_ex_tax": item.extendedSalePrice
                },
                {
                    "product_id": item.productId,
                    "product_options": []
                }
            ];

            products.push(temp_data);
        });
        var cust_id=0;
        if(checkout.hasOwnProperty("customerId"))
        {
            cust_id = checkout.customerId;
        }

        var posting_data={
            status_id:0,
            customer_id:cust_id,
            billing_address:this.state.billingAddress ,
            shipping_addresses:this.state.shippingAddress ,
            products:products
        };

        var temp_data={"store_data":posting_data,"proc":"d8e9b5d8",transaction:details};
        //making request to api
        $.ajax({
            url:'http://www.store.localhost.com:8012/api.php',
            type: 'post',
            data:JSON.stringify(temp_data),
            success: function(data)
            {
                console.log( "ajax response " + data);
                callback( data);
            },
            error: function(error)
            {
                console.log( "error ewsponse " +   JSON.stringify( error));
                callback( error);
            }
        });
}
}
