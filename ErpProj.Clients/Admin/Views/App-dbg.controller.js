sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/core/Fragment",
    "sap/ui/util/Storage"
], function (Device, Controller, JSONModel, Popover, Button, library, Fragment, Storage) {
    "use strict";

    var ButtonType = library.ButtonType,
        PlacementType = library.PlacementType;

    return Controller.extend("ErpProj.Home.Views.App", {

        onInit: function () {
            this.oModel = new JSONModel();
            this.oModel.loadData(sap.ui.require.toUrl("ErpProj/Home/Views/AppModel-dbg.json"), null, false);
            this.getView().setModel(this.oModel);
            var oStorage = new Storage(Storage.Type.local, "user_data");
            this.configureAjaxRequest(oStorage.get("auth"));
        },

        onLoginButtonOkPress: function (event) {
            var me = this;
            me._loginDialogFragment.then(function (oDialog) {
                var oModel = oDialog.getModel(),
                    oData = oModel.getData();
                oDialog.close();

                $.ajax({
                    type: "POST",
                    url: "http://localhost:6001/security/admin/auth/",
                    dataType: "json",
                    data: oData
                }).done(function (result) {
                    var oStorage = new Storage(Storage.Type.local, "user_data");
                    oStorage.put("auth", result);
                }).fail(function (jqXHR, textStatus) {
                    console.log(textStatus);
                });
                
            });
        },

        onLoginButtonCancelPress: function (event) {
            this._loginDialogFragment.then(function (oDialog) {
                oDialog.close();
            });
        },

        configureAjaxRequest: function (auth_data) {
            $.ajaxSetup({
                crossDomain: true,
                headers: !auth_data ? {} : {
                    Authorization: "Bearer " + auth_data.access_token
                } 
            });
        },

        onAuthorizationPress: function (event) {
            var buttons = [];
            var me = this;
            var oView = me.getView();

            var oStorage = new Storage(Storage.Type.local, "user_data");
            var auth_data = oStorage.get("auth");

            me.configureAjaxRequest(auth_data);

            if (!auth_data) {

                buttons.push(new Button({
                    text: "Вход",
                    type: ButtonType.Transparent,
                    press: function (event) {
                        if (!me._loginDialogFragment) {
                            me._loginDialogFragment = Fragment.load({
                                // id: oView.getId(),
                                name: "ErpProj.Home.Views.LoginDialog",
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

            }
            else {

                buttons.push(new Button({
                    text: "Выход",
                    type: ButtonType.Transparent,
                    press: function (event) {
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:6001/security/admin/logoff/",
                            dataType: "json",
                        }).done(function (result) {
                            var oStorage = new Storage(Storage.Type.local, "user_data");
                            oStorage.remove("auth");
                            me.configureAjaxRequest(null);
                        }).fail(function (jqXHR, textStatus) {
                            console.log(textStatus);
                        });
                    }
                }));

            }

            var oPopover = new Popover({
                showHeader: false,
                placement: PlacementType.Bottom,
                content: buttons
            }).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

            var oSender = event.getSource();

            oPopover.openBy(oSender);
        },

        onItemSelect: function (oEvent) {
            var item = oEvent.getParameter("item"),
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