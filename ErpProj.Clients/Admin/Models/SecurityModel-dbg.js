sap.ui.define(
  [
    "sap/ui/core/Core",
    "sap/m/library",
    "sap/ui/model/odata/v2/ODataModel"
  ],
  function (Core, library, ODataModel) {
    var auth_data = Core._userDataStorage.get("auth");
    var routesData = Core.getModel("routes").getData()
    var model = new ODataModel({
      serviceUrl: routesData.security.get.url,
      synchronizationMode: "None",
      json: true,
      useBatch: false,
      headers: !auth_data ? {} : {
        Authorization: "Bearer " + auth_data.access_token,
      }
    });
    return model;
  }
);