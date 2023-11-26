import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v4/Context";
import Component from "sap/ui/core/Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";

/**
 * @namespace create.salesman.controller
 */
export default class App extends Controller {
  view: View;
  dataDialog: Promise<Control | Control[]>;
  dateDialog: Promise<Control | Control[]>;
  rowContext: Context;
  currentDate: Date = new Date();
  startDate: Date = this.currentDate;
  endDate: any = new Date(this.startDate);

  public onInit(): void {
    this.endDate.setFullYear(this.startDate.getFullYear() + 1); // For example, setting the end date to 1 year from the start date

    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        salesman: [
          {
            name: "Patric",
            code: "395-9823",
            region: "TN",
            companyCode: "Z001",
            start: "Oct 23, 2023",
            end: "Oct 21, 2024",
          },
          {
            name: "Alex",
            code: "985-9823",
            region: "TN",
            companyCode: "Z001",
            start: "Oct 3, 2023",
            end: "Oct 7, 2024",
          },
        ],
      }),
      "salesman"
    );
    const minEndDate = structuredClone(this.startDate)
    minEndDate.setDate(this.startDate.getDate() + 1);
    const maxStartDate = structuredClone(this.startDate)
    maxStartDate.setDate(maxStartDate.getDate() + 1);
    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        date: [
          {
            start: this.currentDate,
            startMinDate: new Date(),
            startMaxDate:maxStartDate,
            end: this.endDate,
            endMinDate: minEndDate,      
          },
        ],
      }),
      "date"
    );
  }

  public onValueHelpRequest(oEvent: any): void {
    var sInputValue = oEvent.getSource().getValue(),
      oView = this.getView();

    if (!this.dataDialog) {
      this.dataDialog = Fragment.load({
        id: oView.getId(),
        name: "create.salesman.view.fragment.supplier",
        controller: this,
      }).then(function (dialog: Control | Control[]) {
        oView.addDependent(dialog as UI5Element);
        return dialog;
      });
    }
    this.dataDialog.then(function (dialog: Control | Control[]) {
      (dialog as Dialog).open();
    });
  }

  public onValueHelpClose(oEvent: any): void {
    var oBinding = oEvent.getSource().getBinding("items");
    oBinding.filter([]);
    let aContexts = oEvent.getParameter("selectedContexts");
    if (aContexts && aContexts.length) {
      aContexts.map(function (oContext: any) {
        let selected = oContext.getObject().code;
        console.log(selected);
        return selected;
      });
    }
  }

  public onEdit(oEvent: any): void {
    var oButton = oEvent.getSource(),
      oView = this.getView();
    const that = this;
    if (!this.dateDialog) {
      this.dateDialog = Fragment.load({
        id: oView?.getId(),
        name: "create.salesman.view.fragment.totalLife",
        controller: this,
      }).then(function (dialog: Control | Control[]) {
        oView?.addDependent(dialog as UI5Element);
        return dialog;
      });
    }
    this.dateDialog.then((dialog: Control | Control[]) => {
      (dialog as Dialog).open();
    });
  }

  public onCancel(): void {
    this.dateDialog.then(function (dialog: Control | Control[]) {
      (dialog as Dialog).close();
    });
  }

  public onSave(): void {
    var oButton = this.getView().byId("data");
    this.dateDialog.then(function (dialog: Control | Control[]) {
      (dialog as Dialog).close();
    });
    console.log(oButton);
  }
}
