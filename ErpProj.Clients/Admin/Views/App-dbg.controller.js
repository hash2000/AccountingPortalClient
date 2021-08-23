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

        onToggleOpenState: function () {
            
        },
        
        onItemSelect: function (oEvent) {
            var item = oEvent.getParameter('item');
            this.byId("pageContainer").to(this.getView().createId(item.getKey()));
        },
        
        onMenuButtonPress: function () {
            var toolPage = this.byId("toolPage");

            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        }
    });
});