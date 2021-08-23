sap.ui.define([
    'sap/ui/Device',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/Popover',
    'sap/m/Button',
    'sap/m/library'
], function (Device, Controller, JSONModel, Popover, Button, mobileLibrary) {
    "use strict";
    return Controller.extend("ErpProj.Home.Views.App", {

        onInit: function () {
            this.oModel = new JSONModel();
            this.oModel.loadData(sap.ui.require.toUrl("ErpProj/Home/Views/AppModel-dbg.json"), null, false);
            this.getView().setModel(this.oModel);
        },

        onAuthorizationPress: function () {
            

        },

        onItemSelect: function (oEvent) {
            var item = oEvent.getParameter('item'),
                itemKey = item.getKey();
            var owner = this.getOwnerComponent(),
                router = owner.getRouter();
            router.navTo(itemKey);
        },
        
        onMenuButtonPress: function () {
            var toolPage = this.byId("toolPage");
            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        }
    });
});