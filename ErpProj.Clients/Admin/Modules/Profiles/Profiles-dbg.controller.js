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
        var oView = this.getView();
        oView.getModel().refresh(true);
      },

      onSearch: function () {
        var oView = this.getView(),
          sValue = oView.byId("searchField").getValue(),
          oFilter = new Filter("FullName", FilterOperator.Contains, sValue);

        oView
          .byId("ProfilesTable")
          .getBinding("items")
          .filter(oFilter, FilterType.Application);
      },

      onSort: function () {},

      onCreate: function () {},

      onInputChange: function () {},

      onDelete: function () {
        var oSelected = this.getView().byId("ProfilesTable").getSelectedItem();

        if (oSelected) {
          oSelected
            .getBindingContext()
            .delete("$auto")
            .then(
              function () {
                MessageToast.show(this._getText("deletionSuccessMessage"));
              }.bind(this),
              function (oError) {
                MessageBox.error(oError.message);
              }
            );
        }
      },
    });
  }
);