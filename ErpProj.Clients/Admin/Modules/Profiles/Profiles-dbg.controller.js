sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "ErpProj/Models/SecurityModel",
  ],
  function (
    Device,
    Controller,
    Core,
    mobileLibrary,
    MessageBox,
    Sorter,
    Filter,
    FilterOperator,
    FilterType,
    SecurityModel
  ) {
    "use strict";

    return Controller.extend("ErpProj.Modules.Profiles.Profiles", {
      onInit: function () {
        var me = this,
          oView = me.getView();
        oView.setModel(SecurityModel);
      },

      onExit: function () {
        //this._busyIndicator.destroy();
        //this._busyIndicator = null;
      },

      onRefresh: function () {
        var oView = this.getView(),
          oItems = oView.byId("ProfilesTable").getBinding("items");
        oItems.filter(null, FilterType.Application);
        oView.getModel().refresh(true);
      },

      onSearch: function () {
        var oView = this.getView(),
          sQuery = oView.byId("searchField").getValue(),
          oItems = oView.byId("ProfilesTable").getBinding("items"),
          oFilters = null;

        if (sQuery && sQuery.length > 0) {
          oFilters = new Filter({
            filters: [
              new Filter("FullName", FilterOperator.Contains, sQuery),
              new Filter("Login", FilterOperator.Contains, sQuery)
            ],
            and: false
          });
        }        

        oItems.filter(oFilters, FilterType.Application);
      },

      onSort: function () {},

      onCreate: function () {},

      onInputChange: function () {},

      onDelete: function () {
        var view = this.getView(),
          model = view.getModel(),
          oSelected = view.byId("ProfilesTable").getSelectedItem();
        if (oSelected) {
          var context = oSelected.getBindingContext(),
            path = "/Profile" + context.getPath(),
            oBundle = view.getModel("i18n").getResourceBundle();

          var onCloseAction = function (oAction) {
            if (oAction == MessageBox.Action.YES) {
              model.remove(path);
            }
          };

          MessageBox.show(
            oBundle.getText("removeProfileTitleDetails", [context.getProperty("FullName")]), {
              icon: MessageBox.Icon.INFORMATION,
              title: oBundle.getText("removeProfileTitle"),
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.YES,
              onClose: onCloseAction
            }
          );

        }
      },
    });
  }
);