
// sap.ui.getCore().attachInit(function () {
//     // new sap.ui.core.ComponentContainer({
//     //     name: "ErpProj.Home.Views.App"
//     // }).placeAt("content");
// });


sap.ui.define([
    "sap/ui/core/mvc/XMLView"
], function (XMLView) {
    "use strict";

    XMLView.create({
        viewName: "ErpProj.Home.Views.App"
    }).then(function (oView) {
        oView.placeAt("content");
    });


});