import React, { Fragment } from 'react';
import Alert from '../components/Alert/alert';
import RadioContainer from '../components/RadioContainer/radio-container';
import Section from '../components/Section/section';
import PaymentMethod from './PaymentMethod/payment-method';

export default class Payment extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            paymentData: {},
            methodId: null,
            gatewayId: null,
        };
        this.addPaypalSA();
        console.log("pay methods ",this.props);
    }


    addPaypalSA(){
        var paypal= {
            clientToken:null,
            config:{
                cardCode:null,
                displayName:"Pay with your PayPal account",
                enablePaypal:null,
                helpText:"",
                is3dsEnabled:null,
                isVaultingCvvEnabled:null,
                isVaultingEnabled:false,
                isVisaCheckoutEnabled:null,
                merchantId:null,
                requireCustomerCode:false,
                testMode:false
            },
            gateway: null,
            id: "PayPal",
            initializationData: null,
            logoUrl: "",
            method: "offline",
            nonce: null,
            returnUrl: null,
            supportedCards: [],
            type: "PAYMENT_TYPE_OFFLINE",
            onChange:null,
            onClick:null
        };

        var sage= {
            clientToken:null,
            config:{
                cardCode:null,
                displayName:"Pay with Sage Pay Now",
                enablePaypal:null,
                helpText:"",
                is3dsEnabled:null,
                isVaultingCvvEnabled:null,
                isVaultingEnabled:false,
                isVisaCheckoutEnabled:null,
                merchantId:null,
                requireCustomerCode:false,
                testMode:false
            },
            gateway: null,
            id: "SagePay",
            initializationData: null,
            logoUrl: "",
            method: "offline",
            nonce: null,
            returnUrl: null,
            supportedCards: [],
            type: "PAYMENT_TYPE_OFFLINE",
            onChange:null,
            onClick:null
        };

        this.props.methods.push(paypal);

        console.log("Adding methods ",this.props.methods);
    }
    componentDidUpdate() {
        this.props.onChange(this.state);
    }

    render() {
        return (
            <Section
                header={ 'Payment' }
                body={
                    <Fragment>
                        { this.props.errors &&
                            <Alert body={ this.props.errors.message } />
                        }

                        <RadioContainer
                            label={ 'Payment Method' }
                            body={ this.props.methods.map(method => (
                                <PaymentMethod
                                    key={ method.id }
                                    method={ method }
                                    selected={ this.state.methodId }
                                    onClick={ () => this._onMethodSelect(method.id, method.gateway) }
                                    onChange={ (paymentData) => this.setState({ paymentData }) } />
                            )) } />
                    </Fragment>

                } />

        );
    }

    _onMethodSelect(id, gateway) {
        this.setState({
            methodId: id,
            gatewayId: gateway,
        });

        if(id=="PayPal")
        {
            this._loadPayPalSA();

        }else if(id=="bankdeposit"){


        }else if(id=="instore"){


        }

        this.props.onClick(id, gateway);
    }

    _loadPayPalSA() {
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
       // paypal.Buttons().render('#payment-action-paypal');
    }
}
