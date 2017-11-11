'use strict';

/**
 * Controller that renders the store finder and store detail pages.
 *
 * @module controllers/Stores
 */
importPackage(dw.net);

var StoreMgr = require('dw/catalog/StoreMgr');
var SystemObjectMgr = require('dw/object/SystemObjectMgr');

/* Script Modules */
var app             = require('*/cartridge/scripts/app');
var guard           = require('*/cartridge/scripts/guard');
var resp            = require('*/cartridge/scripts/util/Response');
var pageMeta        = require('*/cartridge/scripts/meta');
var ContinueURL     = dw.web.URLUtils.abs('Stores-FindStores');
var dsStyles        = require('~/cartridge/scripts/modules/util/Styles.ds');

/* Global  Vars */
var API_KEY         = 'AIzaSyBEceGkwXVFsW6aoiFx2spx9B99wbo0v2E',
    mapStyles       = dsStyles('ny'),
    StoresCount, 
    isSearched;

/*
* Map Style
*/

/**
 * Provides a form to locate stores by geographical information.
 *
 * Clears the storelocator form. Gets a ContentModel that wraps the store-locator content asset.
 * Updates the page metadata and renders the store locator page (storelocator/storelocator template).
 */
function find() {
    isSearched = false;
    var storeLocatorForm = app.getForm('storelocator');
    storeLocatorForm.clear();

    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');

    pageMeta.update(storeLocatorAsset);

    var searchResult = function(){
            var searchKey = 'AU';
            var stores = SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'postalCode asc', searchKey);
            if (empty(stores)) {
                return null;
            } else {
                StoresCount = stores.getCount();
                return {
                    'Stores'        : stores, 
                    'searchKey'     : searchKey, 
                    'type'          : 'findbycountry', 
                    'StoresCount'   : StoresCount, 
                    'ContinueURL'   : ContinueURL
                };
            }
    };


    app.getView(searchResult())
            .render('storelocator/storelocatorresults');
    

}

/**
 * The storelocator form handler. This form is submitted with GET.
 * Handles the following actions:
 * - findbycountry
 * - findbystate
 * - findbyzip
 * In all cases, gets the search criteria from the form (formgroup) passed in by
 * the handleAction method and queries the platform for stores matching that criteria.
 * If there are search results, renders the store results page 
 * (storelocator/storelocatorresults template), otherwise renders the store locator page
 * (storelocator/storelocator template).
 */
function findStores() {
    isSearched = true;
    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');

    pageMeta.update(storeLocatorAsset);

    var storeLocatorForm = app.getForm('storelocator');
    var searchResult = storeLocatorForm.handleAction({
        findbycountry: function (formgroup) {
            var searchKey = formgroup.country.htmlValue;
            var stores = SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'countryCode desc', searchKey);
            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbycountry'};
            }
        },
        findbystate: function (formgroup) {
            var searchKey = formgroup.state.htmlValue;
            var stores = null;

            if (!empty(searchKey)) {
                stores = SystemObjectMgr.querySystemObjects('Store', 'stateCode = {0}', 'stateCode desc', searchKey);
            }

            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbystate'};
            }
        },
        findbyzip: function (formgroup) {

             var searchKey = formgroup.postalCode.value;

             var httpClient : HTTPClient = new HTTPClient();
             var message : String;
             var responseLongName : String;
             httpClient.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?components=country:AU&address='+searchKey+'&sensor=false&key=' + API_KEY);
             httpClient.send();
             if (httpClient.statusCode == 200)
             {
                message = httpClient.text;

                messagedata         = JSON.parse(message);
                formatted_address   =  messagedata.results[0]['formatted_address'];
                location_lat        =  messagedata.results[0]['geometry']['location']['lat'];
                location_lng        =  messagedata.results[0]['geometry']['location']['lng'];

             }
             else
             {
                 message="An error occurred with status code "+httpClient.statusCode;
             }

            var storesMgrResult = dw.catalog.StoreMgr.searchStoresByCoordinates(location_lat,location_lng,'km', formgroup.maxdistance.value)
            var stores = storesMgrResult.keySet();

            if (empty(stores)) {
                return null;
            } else {

                StoresCount = stores.length;

                return {
                    'Stores'            : stores, 
                    'searchKey'         : searchKey, 
                    'type'              : 'findbyzip', 
                    'StoresCount'       : StoresCount, 
                    'ContinueURL'       : ContinueURL,
                    'formatted_address' : formatted_address,
                    'location_lat'      : location_lat,
                    'location_lng'      : location_lng
                };
            }
        }
    });
    
    if (searchResult) {
        app.getView(searchResult)
            .render('storelocator/storelocatorresults');
    } else {
        app.getView({isSearched: isSearched})
            .render('storelocator/storelocator');
    }

}

/**
 * Renders the jsonpage of store search results using params.
 * Gets the store data from the httpParameterMap. Updates the page metadata.
 * Renders the stores search result json page (storelocator/storelocatorjson template).
 */
function getstoreJson() {

    isSearched = true;
    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');

    pageMeta.update(storeLocatorAsset);

    var storeLocatorForm = app.getForm('storelocator');
    var searchResult = storeLocatorForm.handleAction({
        findbycountry: function (formgroup) {
            var searchKey = formgroup.country.htmlValue;
            var stores = SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'countryCode desc', searchKey);
            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbycountry'};
            }
        },
        findbystate: function (formgroup) {
            var searchKey = formgroup.state.htmlValue;
            var stores = null;

            if (!empty(searchKey)) {
                stores = SystemObjectMgr.querySystemObjects('Store', 'stateCode = {0}', 'stateCode desc', searchKey);
            }

            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbystate'};
            }
        },
        findbyzip: function (formgroup) {

             var searchKey = formgroup.postalCode.value;

             var httpClient : HTTPClient = new HTTPClient();
             var message : String;
             var responseLongName : String;
             httpClient.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?components=country:AU&address='+searchKey+'&sensor=false&key=' + API_KEY);
             httpClient.send();
             if (httpClient.statusCode == 200)
             {
                message = httpClient.text;

                messagedata         = JSON.parse(message);
                formatted_address   =  messagedata.results[0]['formatted_address'];
                location_lat        =  messagedata.results[0]['geometry']['location']['lat'];
                location_lng        =  messagedata.results[0]['geometry']['location']['lng'];

             }
             else
             {
                 message="An error occurred with status code "+httpClient.statusCode;
             }


            var storesMgrResult = dw.catalog.StoreMgr.searchStoresByCoordinates(location_lat,location_lng,'km', formgroup.maxdistance.value)
            var stores = storesMgrResult.keySet();

            if (empty(stores)) {
                return null;
            } else {

                StoresCount = stores.length;

                return {
                    'mapStyles'         : JSON.stringify(mapStyles),
                    'Stores'            : stores, 
                    'searchKey'         : searchKey, 
                    'type'              : 'findbyzip', 
                    'StoresCount'       : StoresCount, 
                    'ContinueURL'       : ContinueURL,
                    'formatted_address' : formatted_address,
                    'location_lat'      : location_lat,
                    'location_lng'      : location_lng
                };
            }
        }
    });

    app.getView(searchResult).render('storelocator/storelocatorjson');
}

/**
 * Renders the details of a store.
 *
 * Gets the store ID from the httpParameterMap. Updates the page metadata.
 * Renders the store details page (storelocator/storedetails template).
 */

function details() {

    var storeID = request.httpParameterMap.StoreID.value;
    var store = dw.catalog.StoreMgr.getStore(storeID);

    pageMeta.update(store);

    app.getView({Store: store})
        .render('storelocator/storedetails');

}

/*
 * Exposed web methods
 */

/** 
 * Renders form to locate stores by geographical information.
 * @see module:controllers/Stores~find 
 */
exports.Find = guard.ensure(['get'], find);

/** 
 * The storelocator form handler.
 * @see module:controllers/Stores~findStores 
 * can also be switched to post method, get just made more sense for 
 * page sharing and refreshs without resubmission
 */
exports.FindStores = guard.ensure(['get'], findStores);

/** 
 * The storelocator json page for extending application in the future.
 * @see module:controllers/Stores~FindStoresJson
 */
exports.FindStoresJson = guard.ensure(['get'], getstoreJson);

/** 
 * Renders the details of a store.
 * @see module:controllers/Stores~details 
 */
exports.Details = guard.ensure(['get'], details);
