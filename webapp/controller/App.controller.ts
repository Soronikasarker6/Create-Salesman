import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v4/Context";
import Component from "sap/ui/core/Component";
import JSONModel from "sap/ui/model/json/JSONModel";


/**
 * @namespace create.salesman.controller
 */
export default class App extends Controller {

  dataDialog: Promise<Control | Control[]>;
  rowContext: Context;
  public onInit(): void {
    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        salesman: [
          {
            name: "Patric",
            code: "395-9823",
            region: "TN",
            companyCode: "Z001",
            start:"Oct 23, 2023",
            end:"Oct 21, 2024"
          },
          {
            name: "Alex",
            code: "985-9823",
            region: "TN",
            companyCode: "Z001",
            start:"Oct 3, 2023",
            end:"Oct 7, 2024"
          },
        ],
      }),
      "salesman"
    );

  }

  public onValueHelpRequest(oEvent: any): void{
    var sInputValue = oEvent.getSource().getValue(),
    oView = this.getView();

  if (!this.dataDialog) {
    this.dataDialog = Fragment.load({
      id: oView.getId(),
      name: "create.salesman.view.fragment.supplier",
      controller: this
    }).then(function (dialog: Control | Control[]) {
      oView.addDependent(dialog as UI5Element);
      return dialog;
    });
  }
  this.dataDialog.then(function(dialog: Control | Control[]) {

    (dialog as Dialog).open();
  });

  }

  public onValueHelpClose (oEvent: any): void{
    var oBinding = oEvent.getSource().getBinding("items");
    oBinding.filter([]);
    let aContexts = oEvent.getParameter("selectedContexts");
    if (aContexts && aContexts.length) {
       aContexts.map(function (oContext:any){
      let selected = oContext.getObject().code;
      console.log(selected)
      return selected;
       })
    }
  }
}
