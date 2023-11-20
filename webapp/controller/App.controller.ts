import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v4/Context";


/**
 * @namespace create.salesman.controller
 */
export default class App extends Controller {

  dataDialog: Promise<Control | Control[]>;
  rowContext: Context;
  public onInit(): void {}

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
}
