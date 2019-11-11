/* eslint-disable */
import $ from 'jquery';
import Cookies from "js-cookie/src/js.cookie";
import Noty from "jquery.growl/javascripts/jquery.growl";

export default function (contextData) {

    const compareRequireMessage = contextData.compareRequireMessage;
    const NoItemToCompare = contextData.NoItemToCompare;
    const CompareSuccessMessage = contextData.CompareSuccessMessage;
    const CompareAlreadyAdded = contextData.CompareAlreadyAdded;
    const CompareLimitMessage = contextData.CompareLimitMessage;
    const CompareNotFunction = contextData.CompareNotFunction;
    const CompareRemoveMessage = contextData.CompareRemoveMessage;



    //Comapre when no item to compare
    $(document).on('click', 'a[title="Compare"]', function (event) {
        event.preventDefault();
        var compareList = Cookies.get('compare_list', { path: '/' });
        if (compareList == undefined) {
            $.growl.warning({ title: "Compare", message: NoItemToCompare });
        }
        if (compareList != null || compareList != "") {
            try {
                var Clist = compareList.split(",");
                var totalItems = Clist.length;
                if (totalItems < 2) {
                    $.growl.warning({ title: "Compare", message: compareRequireMessage });
                } else {
                    location.href = $(this).attr('href');
                }
            } catch (ex) { }
        }

    });


    const compareListItems = new Array();
    const compareList = Cookies.get('compare_list', { path: '/' });
    function addToCompare(product_id) {
        var result = findInList(product_id);
        if (result == 1) {
            var compareList = Cookies.get('compare_list', { path: '/' });
            //console.log(compareList);
            var newCompareList = new Array();
            if (compareList != null || compareList != "") {
                try {
                    var Clist = compareList.split(",");
                    for (var i = 0; i < Clist.length; i++) {
                        newCompareList.push(Clist[i]);
                    }
                }
                catch (ex) { }
            }
            newCompareList.push(product_id);

            jQuery(".navUser-item--compare span").html(newCompareList.length);
            if (newCompareList.length > 0) {
                jQuery(".navUser-item--compare").addClass('show');
            }
            Cookies.set('compare_list', newCompareList.toString(), { expires: 7, path: '/' });
            compareCountUpdate();
            $.growl.notice({ title: "Compare", message: CompareSuccessMessage });
            $('.compare-box[data-compare-id="' + product_id + '"]').addClass('compare-active');
            $('.compare-box[data-compare-id="' + product_id + '"]').removeClass('compare-box');
            if (!$('.nav-item-compare').hasClass('active')) {
                $('.nav-item-compare').addClass('active').css('display', 'inline-block');
            }

        } else if (result == 2) {
            $.growl.warning({ title: "Compare", message: CompareAlreadyAdded });
        }
        else if (result == 4) {
            $.growl.warning({ title: "Compare", message: CompareLimitMessage });
        }
        else {
            $.growl.warning({ title: "Compare", message: CompareNotFunction });
        }

    }
    function compareCountUpdate() {
        var compareList = Cookies.get('compare_list', { path: '/' });
        //  console.log(compareList);
        if (compareList != null || compareList != "") {
            try {
                var Clist = compareList.split(",");
                var totalItemsToCompare = parseInt(Clist.length);
                jQuery(".navUser-item--compare span").html(totalItemsToCompare);
                jQuery(".navUser-item--compare span").show();
                jQuery('body').removeClass('emptyCompare');
            }
            catch (ex) {
                // jQuery(".navUser-item--compare span").html("0");
                jQuery(".navUser-item--compare span").hide();
                jQuery('body').addClass('emptyCompare');
            }

        }

        compareNow();
    }
    function findInList(product_id) {
        var compareList = Cookies.get('compare_list', { path: '/' });

        if (compareList != null || compareList != "") {
            try {
                var Clist = compareList.split(",");
                var totalItems = Clist.length;
                if (totalItems >= 4) {
                    return 4;
                }
                for (var i = 0; i < totalItems; i++) {
                    var j = i;
                    if (product_id == Clist[j])
                        return 2;
                }
            } catch (ex) { }
        }
        return 1;


    }
    function removeCompareItem(item) {
        var compareList = Cookies.get('compare_list', { path: '/' });
        var newCompareList = new Array();

        if (compareList != null || compareList != "") {
            try {
                var Clist = compareList.split(",");

                for (var i = 0; i < Clist.length; i++) {

                    if (parseInt(Clist[i]) != parseInt(item)) {
                        newCompareList.push(Clist[i]);
                        $('.compare-box[data-compare-id="' + Clist[i] + '"]').removeClass('compare-active');
                        $('.compare-box[data-compare-id="' + Clist[i] + '"]').addClass('compare-box');
                    }

                }
                jQuery(".navUser-item--compare span").html(newCompareList.length);
                Cookies.set('compare_list', newCompareList.toString(), { expires: 7, path: '/' });

                if (newCompareList.length < 1) {
                    Cookies.remove('compare_list', { path: '/' });
                    jQuery(".navUser-item--compare").removeClass('show');
                }
            }
            catch (ex) { }
            $.growl.warning({ title: "Compare", message: CompareRemoveMessage });
        } else {
            $.growl.warning({ title: "Compare", message: NoItemToCompare });
        }
        compareCountUpdate();
    }

    /* logic to send items to compare page */
    function compareNow() {

        let c_count = parseInt($('.navUser-item--compare span').text());
        if (c_count > 0) {
            $('.navUser-item--compare').addClass('show');
        }
        var compareList = Cookies.get('compare_list', { expires: 7, path: '/' });
        if (compareList != null || compareList != "" || compareList != undefined) {
            try {
                var Clist = compareList.split(",");
                var cItems = "";
                for (var i = 0; i < Clist.length; i++) {
                    cItems += "/" + Clist[i];
                    $('.compare-box[data-compare-id="' + Clist[i] + '"]').addClass("compare-active");
                    $('.compare-box[data-compare-id="' + Clist[i] + '"]').removeClass('compare-box');
                }
                jQuery(".navUser-item--compare").attr("href", "/compare" + cItems);
                if (location.pathname == '/compare/' || location.pathname == '/compare') {
                    location.href = "/compare" + cItems;
                }
            }
            catch (ex) { }
        } else {

            //$.growl.warning({ message: NoItemToCompare });
        }
    }

    if (Cookies.get('compare_list', { path: '/' }) == "" || Cookies.get('compare_list', { path: '/' }) == undefined) {
        Cookies.remove('compare_list', { path: '/' });
    }



    jQuery(document).ready(function () {
        jQuery(document).on("click", ".compare-box", function () {

            addToCompare(jQuery(this).attr("data-compare-id"));

        });

        $(document).on('click', '.compare-active', function () {
            jQuery(this).removeClass('compare-active');
            // console.log(jQuery(this).attr("data-compare-id"));
            removeCompareItem(jQuery(this).attr("data-compare-id"));
            jQuery(this).addClass('compare-box');
        });

        jQuery(document).on("click", ".doRemove", function () {
            removeCompareItem(jQuery(this).attr("data-product-id"));
        });

        if (Cookies.get('compare_list', { path: '/' }) !== "" || Cookies.get('compare_list', { path: '/' }) !== undefined) {
            var compareList = Cookies.get('compare_list', { path: '/' });

            try {
                if (jQuery('.compareTable .card').length == 0) {
                    // jQuery(".navUser-item--compare span").html("0");
                    // jQuery(".navUser-item--compare span").hide();
                    // jQuery('body').addClass('emptyCompare');
                    compareNow();
                    jQuery('.compare-table-wrap').html('<p>'+NoItemToCompare+'</p>');
                    jQuery('.compare-table-wrap .comparTableCustom').css('display', 'block');
                } else {
                    jQuery('.compare-table-wrap .comparTableCustom').css('display', 'block');
                    if (jQuery('.compareTable .card').length == 1) {
                        jQuery(".navUser-item--compare span").html("1");
                        $('.doRemove').attr('href', "/compare/");
                    } else {
                        var Clist = compareList.split(",");
                        var cItems = "";
                        if (Clist.length == 2) {
                            // console.log(Clist[0]);
                            $('.doRemove:not([data-product-id="' + Clist[0] + '"])').attr('href', "/compare/" + Clist[0]);
                            $('.doRemove:not([data-product-id="' + Clist[1] + '"])').attr('href', "/compare/" + Clist[1]);
                        }
                    }
                }

            } catch (ex) {

            }

        }

        $(document).ajaxStop(function () {
            var compareList = Cookies.get('compare_list', { path: '/' });
            if (compareList != null || compareList != "" || compareList != undefined) {
                try {
                    var Clist = compareList.split(",");
                    var cItems = "";
                    for (var i = 0; i < Clist.length; i++) {
                        // console.log(Clist[i])
                        $('.compare-box[data-compare-id="' + Clist[i] + '"]').addClass("compare-active");
                        $('.compare-box[data-compare-id="' + Clist[i] + '"]').removeClass('compare-box');
                    }
                }
                catch (ex) { }
            } else {

                //$.growl.warning({ message: NoItemToCompare });
            }
        });
    });
    compareCountUpdate();
}
/* eslint-enable */
