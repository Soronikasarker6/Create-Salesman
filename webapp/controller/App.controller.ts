import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v4/Context";
import Component from "sap/ui/core/Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import DatePicker from "sap/m/DatePicker";

/**
 * @namespace create.salesman.controller
 */
export default class App extends Controller {
  view: View;
  dataDialog: Promise<Control | Control[]>;
  dateDialog: Promise<Control | Control[]>;
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
    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        date: [
          {
            start: "Oct 23, 2023",
            end: "Oct 21, 2024",
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
  public dateValidation() {
    const maxDate = new Date("2024-01-01");

    const sdate = this.getView().byId("S1") as DatePicker;
    const edate = this.getView().byId("D2") as DatePicker;
    sdate.setMaxDate(maxDate);
    // sdate.setMinDate(new Date("2023-01-01"))
    // edate.setMaxDate(new Date("2024-05-01"))
    // edate.setMinDate(new Date("2023-05-01"))
  }

  handleChange() {
    this.dateValidation();
    console.log("lknjkn");
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
      setTimeout(() => {
        this.dateValidation();
      }, 500);
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
