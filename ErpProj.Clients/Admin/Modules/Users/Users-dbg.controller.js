sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/library"
], function (Device, Controller, Core, ODataModel, mobileLibrary) {
    "use strict";


    return Controller.extend("ErpProj.Modules.Users.Users", {


        onInit: function () {
            var me = this,
                routesData = Core.getModel("routes").getData(),
                view = me.getView();

            var oProfilesModel = new ODataModel(routesData.profiles.get.url);
            view.setModel(oProfilesModel, "profiles");

        }


    });
});