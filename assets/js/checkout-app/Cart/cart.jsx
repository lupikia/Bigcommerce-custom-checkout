import React from 'react';
import { formatMoney } from 'accounting';
import ItemLine from "./ItemLine/item-line";
import styles from './cart.scss';

export default class Cart extends React.PureComponent {

    constructor(props) {
        super(props);

        console.log("subtotal " ,props );
    }

    render() {


        return (
            <div className={ styles.container }>
                <div className={ styles.cartContainer }>
                    <div className={ styles.cartHeaderContainer }>
                        <div className={ styles.cartHeader }>
                            Your Order
                        </div>

                        <a href={ this.props.cartLink } className={ styles.cartAction }>
                            Return to cart
                        </a>
                    </div>

                    { ['physicalItems', 'digitalItems', 'giftCertificates'].map((keyType) => (
                        (this.props.checkout.cart.lineItems[keyType] || []).map((item) => (
                            <ItemLine
                                key={ item.id }
                                label={ `${ item.quantity } x ${ item.name }` }
                                amount={ formatMoney(item.extendedSalePrice,{ symbol: this.props.checkout.cart.currency.symbol}) }
                                imageUrl={ item.imageUrl }/>
                        ))
                    )) }
                </div>

                <div className={ styles.orderSummaryContainer  }>
                    <ItemLine
                        label={ 'Subtotal' }
                        amount={ formatMoney(this.props.checkout.cart.baseAmount,{ symbol: this.props.checkout.cart.currency.symbol}) } />

                    <ItemLine
                        label={ 'Shipping' }
                        amount={ formatMoney(this.props.checkout.shippingCostTotal,{ symbol: this.props.checkout.cart.currency.symbol}) } />

                    <ItemLine
                        label={ 'Tax' }
                        amount={ formatMoney(this.props.checkout.taxTotal,{ symbol: this.props.checkout.cart.currency.symbol}) } />

                    <div className={ styles.grandTotalContainer }>
                        <div className={ styles.grandTotalLabel }>
                            Total
                        </div>

                        <div className={ styles.grandTotalAmount }>
                            { formatMoney(this.props.checkout.grandTotal,{ symbol: this.props.checkout.cart.currency.symbol}) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
