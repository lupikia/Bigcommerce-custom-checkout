
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
            gatewayId: null
        };
        this.addPaypalSA();
    }

    componentDidMount() {



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
        //for(var x=0; x <this.props.methods.length;x++){
        //
        //    console.log("method name " + this.props.methods[x].id);
        //    if(this.props.methods[x].id=="PayPal")
        //    {
        //        this.props.methods[x].click=this._onMethodSelect(this.props.methods[x].id.toString(), this.props.methods[x].gateway);
        //
        //    }else{
        //        this.props.methods[x].click=this._onMethodSelect(this.props.methods[x].id.toString(), this.props.methods[x].gateway);
        //    }
        //};

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
                gatewayId: gateway
            });
        $("#payment-action-paypal").html("");
        //this.props.onClick(id, gateway);
    }


}