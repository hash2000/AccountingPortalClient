sap.ui.define(
  [
    "sap/ui/core/Core",
    "sap/m/library",
    "sap/ui/model/json/JSONModel"
  ],
  function (
    Core,
    library,
    JSONModel
  ) {
    "use strict";

    // var auth_data = Core._userDataStorage.get("auth");
    // var routes_data = Core.getModel("routes").getData();
    // var model = new ODataModel({
    //   serviceUrl: routesData.security.get.url,
    //   synchronizationMode: "None",
    //   json: true,
    //   useBatch: false,
    //   headers: !auth_data ? {} : {
    //     Authorization: "Bearer " + auth_data.access_token,
    //   }
    // });

    //routes_data.security.profiles.url

    var ProfilesModel = JSONModel.extend("ErpProj.Models.Security.ProfilesModel", {

      constructor: function (mParameters) {
        JSONModel.apply(this, arguments);
        
        this.mPageSize = 25;

        if (mParameters) {
          this.mPageSize = mParameters.pageSize;
        }

      },

      metadata: {
        publicMethods: [
          "loadPage"
        ]
      }

    });

    ProfilesModel.prototype.loadPage = function (page) {
      
    };

    return ProfilesModel;
  }
);