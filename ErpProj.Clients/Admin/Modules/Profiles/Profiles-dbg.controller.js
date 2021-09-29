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
    "ErpProj/Models/Security/ProfilesModel",
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
    ProfilesModel
  ) {
    "use strict";

    return Controller.extend("ErpProj.Modules.Profiles.Profiles", {
      onInit: function () {
        var me = this,
          oView = me.getView(),
          oModel = new ProfilesModel();
        oModel.loadPage(0);
        oView.setModel(oModel);
      },

      onExit: function () {
        //this._busyIndicator.destroy();
        //this._busyIndicator = null;
      },

      onRefresh: function () {
        this.getView().getModel().reload();
      },

      onSearch: function () {
        var oView = this.getView(),
          oModel = oView.getModel(),
          sQuery = oView.byId("searchField").getValue();        
        if (sQuery && sQuery.length > 0) {
          oModel.setFilters(sQuery);
          oModel.loadPage(0);
        }
      },

      onSort: function () {},

      onCreate: function () {},

      onInputChange: function () {},

      onDelete: function () {
        // var view = this.getView(),
        //   model = view.getModel(),
        //   oSelected = view.byId("ProfilesTable").getSelectedItem();
        // if (oSelected) {
        //   var context = oSelected.getBindingContext(),
        //     path = "/Profile" + context.getPath(),
        //     oBundle = view.getModel("i18n").getResourceBundle();

        //   var onCloseAction = function (oAction) {
        //     if (oAction == MessageBox.Action.YES) {
        //       model.remove(path);
        //     }
        //   };

        //   MessageBox.show(
        //     oBundle.getText("removeProfileTitleDetails", [context.getProperty("FullName")]), {
        //       icon: MessageBox.Icon.INFORMATION,
        //       title: oBundle.getText("removeProfileTitle"),
        //       actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        //       emphasizedAction: MessageBox.Action.YES,
        //       onClose: onCloseAction
        //     }
        //   );

        // }
      },
    });
  }
);