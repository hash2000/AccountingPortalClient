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
    var _routesData = Core.getModel("routes").getData();
    // var model = new ODataModel({
    //   serviceUrl: routesData.security.get.url,
    //   synchronizationMode: "None",
    //   json: true,
    //   useBatch: false,
    //   headers: !auth_data ? {} : {
    //     Authorization: "Bearer " + auth_data.access_token,
    //   }
    // });

    //_routesData.security.profiles.url

    var ProfilesModel = JSONModel.extend("ErpProj.Models.Security.ProfilesModel", {

      constructor: function (mParameters) {
        JSONModel.apply(this, arguments);
        
        this.mPageSize = 25;
        this.nCurrentPage = 0;
        this.pFilters = null;

        if (mParameters) {
          this.mPageSize = mParameters.pageSize;
        }

      },

      metadata: {
        publicMethods: [
          "loadPage",
          "reload",
          "setFilters",
          "dropFilters"
        ]
      }

    });

    ProfilesModel.prototype.loadPage = function (page) {
      
      var parameters = {
        skip: this.mPageSize * page,
        limit: this.mPageSize
      };

      if (this.pFilters) {
        parameters.filters = this.pFilters
      }

      this.loadData(_routesData.security.profiles.url, parameters);
      this.nCurrentPage = page;
    };

    ProfilesModel.prototype.reload = function () {
      this.loadPage(this.nCurrentPage);
    };
    
    ProfilesModel.prototype.setFilters = function (filters) {      
      this.pFilters = filters;
    },
      
    ProfilesModel.prototype.dropFilters = function () {
      this.pFilters = null;
    }

    return ProfilesModel;
  }
);