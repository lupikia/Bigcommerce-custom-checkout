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
import utils from '@bigcommerce/stencil-utils';


export default class Checkout extends React.PureComponent {
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props));
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
            this.service.initializeSpamProtection({ containerId: 'spamProtectionContainer' });
        });
        ppy_state=this.state;
        ppy_service=this.service;

    }

    componentWillUnmount() {
        this.unsubscribe();
        alert("l");
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
                                    checkout={ data.getCheckout() }
                                    isUpdatingConsignment={ statuses.isUpdatingConsignment }
                                    isCreatingConsignments={ statuses.isCreatingConsignments }
                                    isUpdatingShippingAddress={ statuses.isUpdatingShippingAddress }
                                    address={ data.getShippingAddress() }
                                    countries={ data.getShippingCountries() }
                                    options={ data.getShippingOptions() }
                                    selectedOptionId={ data.getSelectedShippingOption() ? data.getSelectedShippingOption().id : '' }
                                    isSelectingShippingOption ={ statuses.isSelectingShippingOption }
                                    onShippingOptionChange={ (optionId) => this._updateShipping(optionId) }
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
                                    onChange ={ (billingAddress) => this.setState({ billingAddress })  }
                                    onSelect ={ (billingAddressSameAsShippingAddress) => this.setState({ billingAddressSameAsShippingAddress })  } />
                                <div className={ styles.actionContainer }>
                                <PaymentAction/>
                                    <SubmitButton
                                        label={ this._isPlacingOrder() ?
                                            'Placing your order...' :
                                            `Pay`
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
    _updateShipping(optionId){


        this.service.selectShippingOption(optionId);
        $("#payment-action-paypal").html("");
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

        var temp_cart = this.state.data.getCheckout().grandTotal;

        if(this.state.payment.methodId=="PayPal"){

            var temp_data={
                "proc": "9b5d8d8e",
                "token": "2e41c582a87a40ec",
                "client": "95a63182545940c5",
                "value":temp_cart };
            var url ="http://www.store.localhost.com:8012/api.php";
            if(window.location.host!=="localhost"){
                url="https://bookmed.co.za/storeapi/api.php";
            }
            $.ajax({
                url:url,
                type: 'post',
                crossDomain: true,
                HEADERS:{'Access-Control-Allow-Origin':'*'},
                data:JSON.stringify(temp_data),
                success: function(success) {


                    $("#form-submit-button").hide();
                    var new_value =success.data.exe_rate.toFixed(2);
                    paypal.Buttons({
                        createOrder: function (data, actions) {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value:new_value
                                    }
                                }]
                            });
                        },
                        onApprove: function (data, actions) {
                            return actions.order.capture().then(function (details) {

                                $("#order-information").show();
                                $("body").scrollTop();
                                internal._submitOrder(isGuest, details, function (success) {

                                    if (success.status)
                                    {
                                        console.log("Deleting 0");
                                        var cart_id=internal.state.data.getCart().id;
                                        $.ajax({
                                            url:"/api/storefront/carts/"+cart_id,
                                            type: 'DELETE',
                                            success: function(data)
                                            {
                                                //change pop info
                                                $("#customer-name").text(internal.state.shippingAddress.firstName);
                                                $("#order").text(success.data.id);

                                                $("#confirmation-order").show();
                                            },
                                            error: function(error)
                                            {
                                                console.log("Deleting 2",error);
                                            }
                                        });

                                    } else {
                                        //error message
                                    }
                                });
                            });
                        }
                    }).render('#payment-action-paypal');
                },
                error: function(error)
                {
                    console.log( "error ewsponse " +   JSON.stringify( error));
                }

            });
        }else{

          //configuration payment methods by store

            //let billingAddressPayload = this.state.billingAddressSameAsShippingAddress ?
            //    this.state.shippingAddress :
            //    this.state.billingAddress;
            //
            //billingAddressPayload = { ...billingAddressPayload, email: this.state.customer.email };
            //
            //let {payment} = this.state;
            //this.setState({ isPlacingOrder: true });
            //event.preventDefault();
            //
            //Promise.all([
            //    isGuest ? this.service.continueAsGuest(this.state.customer) : Promise.resolve(),
            //    this.service.updateBillingAddress(billingAddressPayload),
            //])
            //.then(function(){
            //    internal.service.submitOrder({ payment }) ;
            //    console.log("redirecting 1");
            //    window.location = "/order-confirmation";
            //} )
            //.then(({ data }) => {
            //
            //    console.log("redirecting  2");
            //    window.location = "/order-confirmation";
            //})
            //.catch(function() {
            //    console.log("redirecting 3");
            //    ppy_response2=internal;
            //    window.location = "/order-confirmation";
            //      internal.setState({isPlacingOrder: false})
            //});
            let billingAddressPayload = this.state.billingAddressSameAsShippingAddress ?
                this.state.shippingAddress :
                this.state.billingAddress;

            billingAddressPayload = { ...billingAddressPayload, email: this.state.customer.email };

            let { payment } = this.state;

            this.setState({ isPlacingOrder: true });
            event.preventDefault();

            Promise.all([
                isGuest ? this.service.continueAsGuest(this.state.customer) : Promise.resolve(),
                this.service.updateBillingAddress(billingAddressPayload),
            ])
                .then(() => this.service.submitOrder({ payment }))
                .then(({ data }) => {
                    window.location.href = data.getConfig().links.orderConfirmationLink;
                })
                .catch(() => this.setState({ isPlacingOrder: false }));
        }
    }

    _submitOrder(isGuest,details,callback ) {

        this.setState({ isPlacingOrder: true });
        var checkout = this.state.data.getCart();
        var products =[];
        checkout.lineItems.physicalItems.forEach(function(item){


            products.push(
                {
                    "product_id": item.productId,
                    "name": item.name,
                    "quantity": item.quantity,
                    "price_inc_tax": item.extendedListPrice,
                    "price_ex_tax": item.extendedSalePrice
                }/*,
                {
                    "product_id": item.productId,
                    "product_options": []
                }*/);
        });
        var cust_id=0;
        if(checkout.hasOwnProperty("customerId"))
        {
            cust_id = checkout.customerId;
        }
        this.state.billingAddress.email=this.state.customer.email;
        this.state.shippingAddress.email=this.state.customer.email;
        var posting_data={
            status_id:0,
            customer_id:cust_id,
            billing_address:this.state.billingAddress ,
            shipping_addresses:[this.state.shippingAddress] ,
            products:products
        };
        this.service.updateBillingAddress(this.state.shippingAddress.email);
        var temp_data={"store_data":posting_data,"proc":"d8e9b5d8",transaction:details};

        ppy_state=this.state;
        ppy_service=this.service;

        //making request to api
        var url ="http://www.store.localhost.com:8012/api.php";
        if(window.location.host!=="localhost"){
            url="https://bookmed.co.za/storeapi/api.php";
        }
        $.ajax({
            url:url,
            type: 'post',
            HEADERS:{'Access-Control-Allow-Origin':'*'},
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
