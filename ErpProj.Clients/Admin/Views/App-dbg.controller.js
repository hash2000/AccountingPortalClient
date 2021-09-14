sap.ui.define([
    'sap/ui/Device',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/Popover',
    'sap/m/Button',
    'sap/m/library',
    'sap/ui/core/Fragment',
    'sap/ui/model/odata/v4/ODataModel'
], function (Device, Controller, JSONModel, Popover, Button, library, Fragment, ODataModel) {
    "use strict";

    var ButtonType = library.ButtonType,
        PlacementType = library.PlacementType;

    return Controller.extend("ErpProj.Home.Views.App", {

        onInit: function () {
            this.oModel = new JSONModel();
            this.oModel.loadData(sap.ui.require.toUrl("ErpProj/Home/Views/AppModel-dbg.json"), null, false);
            this.getView().setModel(this.oModel);
        },

        onLoginButtonOkPress: function (event) {
            var me = this;
            me._loginDialogFragment.then(function (oDialog) {
                var oModel = oDialog.getModel(),
                    oData = oModel.getData();

                var authModel = new JSONModel();
                authModel.loadData(
                    "http://localhost:6001/security/admin/auth/", oData, true, "POST"
                ).then(function (result) {
                    console.log(result);
                }).catch(function (result) {
                    console.log(result);
                });
                //var request = new ODataModel({
                //    requestUri: "http://localhost:6001/security/admin/auth/",
                //    method: "POST",
                //    metadataUrlParams: oData,
                //    synchronizationMode: "None"
                //});

                oDialog.close();
            });
        },

        onLoginButtonCancelPress: function (event) {
            this._loginDialogFragment.then(function (oDialog) {
                oDialog.close();
            });
        },

        onAuthorizationPress: function (event) {
            var buttons = [];
            var me = this;
            var oView = me.getView();

            buttons.push(new Button({
                text: 'Вход',
                type: ButtonType.Transparent,
                press: function (event) {
                    if (!me._loginDialogFragment) {
                        me._loginDialogFragment = Fragment.load({
                            // id: oView.getId(),
                            name: 'ErpProj.Home.Views.LoginDialog',
                            controller: me
                        }).then(function (oDialog) {
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }

                    me._loginDialogFragment.then(function (oDialog) {
                        var oModel = new JSONModel({
                            grant_type: "password",
                            username: "",
                            password: ""
                        });
                        oDialog.setModel(oModel);
                        oDialog.open();
                    });
                }
            }));

            var oPopover = new Popover({
                showHeader: false,
                placement: PlacementType.Bottom,
                content: buttons
            }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

            var oSender = event.getSource();

            oPopover.openBy(oSender);
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