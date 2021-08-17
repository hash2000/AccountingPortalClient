
// sap.ui.getCore().attachInit(function () {
//     // new sap.ui.core.ComponentContainer({
//     //     name: "ErpProj.Home.Views.App"
//     // }).placeAt("content");
// });


sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
    "use strict";

    new ComponentContainer({
        name: "ErpProj.Home",
        settings: {
            id: "walkthrough"
        },
        async: true
    }).placeAt("content");


});