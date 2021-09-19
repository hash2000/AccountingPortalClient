sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
  ],
  function (
    Device,
    Controller,
    Core,
    mobileLibrary,
    MessageBox,
    ODataModel,
    JSONModel,
    Sorter,
    Filter,
    FilterOperator,
    FilterType
  ) {
    "use strict";

    return Controller.extend("ErpProj.Modules.Profiles.Profiles", {
      onInit: function () {
        var me = this,
          oView = me.getView(),
          routesData = Core.getModel("routes").getData();

        //var profilesModel = new ODataModel(routesData.profiles.get.url);
        //var auth_data = Core._userDataStorage.get("auth");
        //if (auth_data) {
        //    profilesModel.setHeaders({
        //        Authorization: "Bearer " + auth_data.access_token
        //    });
        //}

        var profilesModel = new JSONModel(routesData.profiles.get.url);

        oView.setModel(profilesModel);
      },

      onExit: function () {
        //this._busyIndicator.destroy();
        //this._busyIndicator = null;
      },

      onRefresh: function () {
        var oView = this.getView(),
          oBinding = oView.byId("ProfilesTable").getBinding("items");
        if (oBinding) {
          //if (oBinding.hasPendingChanges()) {
          //    MessageBox.error("Before refreshing, please save or revert your changes");
          //    return;
          //}
          oBinding.refresh(true);
        }
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
