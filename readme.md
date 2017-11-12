# Sales Force Commerce Cloud - Store Locator Cartridge  

This document provides technical instructions for installing and using Store Locator Cartridge, which enables store locator features for Sales Force Commerce Cloud. By no means are the features exhaustive. As we develop other projects we can easily extend the application.  

A variety of tools and API's have also been included in order to make extension easier in the future such as JSON stored results, preferences which can be stored as custom objects and managed by the client in Business Manager, custom styles as well as methods for fetching data based on custom values.

### Features

Developers using the Store Locator Cartridge can access and extend the following features:

1.  Search Stores by distance using Google's geocode API
2.  Calculate Distance in KM or MI between search point and returned stores
3.  Multiple Stores pinned on map
4.  Clustered Map
5.  JSON page which is queryable via URL params


### Setup
Copy the cartridge `store_locator` to your root cartridge folder. This folder should contain all for your other cartridges as well.

#### Configuration

##### Step 1

Navigate to the following path `"Sites > Manage Sites > <Merchant Site> - Settings"`

Add the cartridge name ` store_locator` to the Cartridges path.

The cartridge has to be added after the app controller cartridge, since we need the newly defined methods to supersede the default `Stores.js`  controller methods.

##### Step 2

Add `store_locator/cartridge/js/pages/storelocator.js` to your application cartridge path so that it can be bundled with your JS module bundler. Alternative you can just require this file as well, which ever you prefer. 

##### Step 3

Install the google marker cluster packager. 

We're using the following google maps package to create map clusters. This allows allows u to group stores that are very close together into a clickable object.
More info here:
https://www.npmjs.com/package/js-marker-clusterer 
More info on the package here: 
https://developers.google.com/maps/documentation/javascript/marker-clustering

```
npm install -D js-marker-clusterer
```


### Additional Developer Notes


JSON URL
`Sites-SDS-Site/en_AU/Stores-FindStoresJson`

URL Params to customize fetched data

2 Character country code to search
`dwfrm_storelocator_countryCode=AU&`

Distance Unit (avialable options are `km` and `mi`)
`dwfrm_storelocator_distanceUnit=mi`

Postal Code (this is also extendable to a readable address as well instead of just postal code)
`dwfrm_storelocator_postalCode=4225`

Calculate Max Distance (uses `dwfrm_storelocator_distanceUnit`)
`dwfrm_storelocator_maxdistance=15`


#### Styling the Map

A helper script is included in 

`store_locator/cartridge/scripts/modules/util/Styles.ds`

The goal here is to add additional styles to switch through. One style `ny` is currently provided.

Additional maps can be style here and the style object can be added. 

A easy tool to help with map styling is SnazzyMaps
https://snazzymaps.com/explore

You can add a custom pin to your map by adding a path to the image to the `customicon` global variable found in `store_locator/cartridge/js/pages/storelocator.js`.

Example JSON response

```
// 20171111091633
// Stores-FindStoresJson?dwfrm_storelocator_countryCode=AU&dwfrm_storelocator_distanceUnit=mi&dwfrm_storelocator_findbyzip=Search&dwfrm_storelocator_postalCode=4225&dwfrm_storelocator_maxdistance=15

{
  "StoresCount": "5",
  "type": "findbyzip",
  "searchKey": "4225",
  "formatted_address": "Coolangatta QLD 4225, Australia",
  "location_lat": "-28.164389",
  "location_lng": "153.5127518",
  "stores": [
    {
      "storeid": "1470",
      "storelat": "-28.159802",
      "storelon": "153.50951",
      "storename": "Surf Dive n Ski",
      "storephone": "07 5599 3048",
      "addressa": "T05, T1 Gold Coast International Airport, 248 Coolangatta Rd",
      "addressb": "null",
      "city": "Gold Coast",
      "stateCode": "QLD",
      "postalCode": "4225"
    },
    {
      "storeid": "1001",
      "storelat": "-28.167149",
      "storelon": "153.520493",
      "storename": "Kirra Surf",
      "storephone": "07 5536 3922",
      "addressa": "8 Creek Street, Kirra",
      "addressb": "null",
      "city": "Kirra",
      "stateCode": "QLD",
      "postalCode": "4225"
    },
    {
      "storeid": "1225",
      "storelat": "-28.133",
      "storelon": "153.45",
      "storename": "Surf Dive n Ski",
      "storephone": "07 5525 7738",
      "addressa": "Shop 5, The Pines Shopping Centre, cnr KP McGrath Dr and Guineas Creek Rd",
      "addressb": "null",
      "city": "The Pines",
      "stateCode": "QLD",
      "postalCode": "4221"
    },
    {
      "storeid": "1216",
      "storelat": "-28.097473",
      "storelon": "153.440921",
      "storename": "Surf Dive n Ski",
      "storephone": "07 5576 2499",
      "addressa": "Shop 74, Stockland Burleigh, 149 West Burleigh Rd",
      "addressb": "null",
      "city": "Burleigh Heads",
      "stateCode": "QLD",
      "postalCode": "4220"
    },
    {
      "storeid": "1050",
      "storelat": "-28.057763",
      "storelon": "153.436136",
      "storename": "Local Knowledge",
      "storephone": "07 5526 6377",
      "addressa": "2251 Gold Coast Highway, Nobbys Beach",
      "addressb": "null",
      "city": "Nobbys",
      "stateCode": "QLD",
      "postalCode": "4218"
    }
  ],
  "style": "[{\"featureType\":\"all\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"saturation\":36},{\"color\":\"#000000\"},{\"lightness\":40}]},{\"featureType\":\"all\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"visibility\":\"on\"},{\"color\":\"#000000\"},{\"lightness\":16}]},{\"featureType\":\"all\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"administrative\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":20}]},{\"featureType\":\"administrative\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":17},{\"weight\":1.2}]},{\"featureType\":\"landscape\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":20}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":21}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":17}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":29},{\"weight\":0.2}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":18}]},{\"featureType\":\"road.local\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":16}]},{\"featureType\":\"transit\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":19}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"},{\"lightness\":17}]}]"
}
```



#### Queries

On initial load of the store locator page we are querying the `SystemObjectMgr` and loading all of the stores for a given country using the following method

```
SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'countryCode desc', searchKey);
```

On search we are using the `StoreMgr` class to fetch data falling within a certain distance (distance is returned using `lat` `lng` which is returned using the response from 
`https://maps.googleapis.com/maps/api/geocode/json` 

```
dw.catalog.StoreMgr.searchStoresByCoordinates(location_lat,location_lng,'km', formgroup.maxdistance.value)
```

Additional methods available to the `StoreMgr` class are:

```
static getAllStoreGroups() : Collection
```
Returns all the store groups of the current site.

```
static getStore(storeID : String) : Store
```
Returns the store object with the specified id or null if store with this id does not exist in the site.

```
static getStoreGroup(storeGroupID : String) : StoreGroup
```
Returns the store group with the specified id or null if the store group with this id does not exist in the current site.

```
static searchStoresByCoordinates(latitude : Number, longitude : Number, distanceUnit : String, maxDistance : Number, queryString : String, args : Object...) : LinkedHashMap
```
Search for stores based on geo-coordinates.

```
static searchStoresByCoordinates(latitude : Number, longitude : Number, distanceUnit : String, maxDistance : Number) : LinkedHashMap
```
Convenience method.

```
static searchStoresByPostalCode(countryCode : String, postalCode : String, distanceUnit : String, maxDistance : Number, queryString : String, args : Object...) : LinkedHashMap
```
Search for stores by country/postal code and optionally by additional filter criteria.

```
static searchStoresByPostalCode(countryCode : String, postalCode : String, distanceUnit : String, maxDistance : Number) : LinkedHashMap
```
Convenience method.



#### Exposed Web Methods

```
exports.Find = guard.ensure(['get'], find);

exports.FindStores = guard.ensure(['get'], findStores);

exports.FindStoresJson = guard.ensure(['get'], getstoreJson);

exports.Details = guard.ensure(['get'], details);
```

