import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';
import { defaultModal } from './modal';
import 'slick-carousel';

export default function (context) {
    const modal = defaultModal();

    $('body').on('click', '.quickview', event => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('productId');

        modal.open({ size: 'large' });

        utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
            modal.updateContent(response);

            modal.$content.find('.productView').addClass('productView--quickView');

            modal.$content.find('[data-slick]').slick({
                nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"><svg class="product-slick-arrow"><use xlink:href="#icon-slick-arow-right"></use></svg><svg><use xlink:href="#icon-chevron-right"></use></svg></button>',
                prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"><svg class="product-slick-arrow"><use xlink:href="#icon-slick-arow-left"></use></svg><svg><use xlink:href="#icon-chevron-left"></use></svg></button>',
            });

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
    });
}
