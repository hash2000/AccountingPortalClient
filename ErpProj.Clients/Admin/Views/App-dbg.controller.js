sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/util/Storage",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/ui/core/message/Message",
    "sap/ui/core/Core"
], function (Device, Controller, JSONModel, Popover, Button, library, coreLibrary, Fragment, Storage, MessagePopover, MessageItem, Message, Core) {
    "use strict";

    var ButtonType = library.ButtonType,
        PlacementType = library.PlacementType,
        MessageType = coreLibrary.MessageType;

    return Controller.extend("ErpProj.Home.Views.App", {

        onInit: function () {
            var me = this,
                oView = me.getView();

            me._userDataStorage = new Storage(Storage.Type.local, "user_data");

            me._messageManager = Core.getMessageManager();
            me._messageManager.removeAllMessages();
            oView.setModel(me._messageManager.getMessageModel(), "message");

            me.configureAuthorizationInfo();
        },

        checkPopoverMessageCount: function (flush_read_flag) {
            var me = this,
                oView = this.getView(),
                oShellBar = oView.byId("Application-ShellBar"),
                model = me._messageManager.getMessageModel(),
                data = model.getData();

            var count = 0;
            data.forEach(function (message) {
                if (flush_read_flag) {
                    message.code = true;
                }
                if (!message.code) {
                    count++;
                }
            });

            oShellBar.setNotificationsNumber(count);
        },

        addPopoverMessage: function (type, target, message, additionalText) {
            var me = this;

            me.createMessagePopover();
            me._messageManager.addMessages(
                new Message({
                    message: message,
                    additionalText: additionalText,
                    controlIds: target,
                    type: type,
                    code: false /* already read */
                })
            );

            me.checkPopoverMessageCount(false);
        },

        createMessagePopover: function () {
            var me = this;

            if (me._messagePopover) {
                return;
            }

            me._messagePopover = new MessagePopover({
                activeTitlePress: function (oEvent) {
                    var oItem = oEvent.getParameter("item"),
                        oPage = that.getView().byId("messageHandlingPage"),
                        oMessage = oItem.getBindingContext("message").getObject(),
                        oControl = Element.registry.get(oMessage.getControlId());

                    if (oControl) {
                        oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
                        setTimeout(function () {
                            oControl.focus();
                        }, 300);
                    }
                },
                items: {
                    path: "message>/",
                    template: new MessageItem({
                        title: "{message>message}",
                        subtitle: "{message>additionalText}",
                        type: "{message>type}",
                        description: "{message>additionalText}"
                    })
                },
                groupItems: true
            });

            me.getView()
                .byId("Application-Avatar-CurrentUser")
                .addDependent(me._messagePopover);

        },

        onShellNotificationPress: function (event) {
            var me = this;
            me.createMessagePopover();
            me._messagePopover.toggle(event.getParameters().button);
            me.checkPopoverMessageCount(true);
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
                    me._userDataStorage.put("auth", result);
                    me.configureAuthorizationInfo();
                    me.addPopoverMessage(MessageType.Success, "Authorization",
                        "Вход в систему", "Пользователь '" + oData.username + "' вошёл в систему");                    
                }).fail(function (jqXHR, textStatus) {
                    me.addPopoverMessage(MessageType.Error, "Authorization",
                        "Вход в систему", textStatus);
                });

            });
        },

        onLoginButtonCancelPress: function (event) {
            this._loginDialogFragment.then(function (oDialog) {
                oDialog.close();
            });
        },

        configureAuthorizationInfo: function () {
            var me = this,
                oView = me.getView(),
                oToolPage = me.byId("Application-ToolPage"),
                auth_data = me._userDataStorage.get("auth");
            

            $.ajaxSetup({
                crossDomain: true,
                headers: !auth_data ? {} : {
                    Authorization: "Bearer " + auth_data.access_token
                }
            });

            
            if (!auth_data) {
                var oNavigationModel = oView.getModel();
                if (oNavigationModel) {
                    oNavigationModel.setData(null, false);
                }
                oToolPage.setSideExpanded(false);
            }
            else {
                var oNavigationModel = new JSONModel();
                oNavigationModel.loadData(sap.ui.require.toUrl("ErpProj/Home/navigation-menu.json"), null, false);
                oView.setModel(oNavigationModel);

                oToolPage.setSideExpanded(true);
            }            
         
        },

        onAuthorizationPress: function (event) {
            var buttons = [],
                me = this,
                oView = me.getView();

            var auth_data = me._userDataStorage.get("auth");
            // me.configureAuthorizationInfo();

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
                            url: "http://localhost:6001/security/admin/logoff/"
                        }).done(function () {
                            me._userDataStorage.remove("auth");
                            me.configureAuthorizationInfo();
                            me.addPopoverMessage(MessageType.Success, "Authorization",
                                "Выход из системы", "Пользователь вышел из системы");                            
                        }).fail(function (jqXHR, textStatus) {
                            me.addPopoverMessage(MessageType.Error, "Authorization",
                                "Выход из системы", textStatus);
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
            var me = this,
                oToolPage = me.byId("Application-ToolPage");
            
            if (!me._userDataStorage.get("auth")) {
                return;
            }

            me.byId("Application-ToolPage")
                .setSideExpanded(!toolPage.getSideExpanded());
        }
    });
});