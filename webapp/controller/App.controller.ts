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
  total: any = 0;
  public onInit(): void {
    this.endDate.setFullYear(this.startDate.getFullYear() + 1);

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
    const minEndDate = structuredClone(this.startDate);
    minEndDate.setDate(this.startDate.getDate() + 1);
    const maxStartDate = structuredClone(this.startDate);
    maxStartDate.setDate(maxStartDate.getDate() + 1);
    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        date: [
          {
            start: this.currentDate,
            startMinDate: new Date(),
            startMaxDate: maxStartDate,
            end: this.endDate,
            endMinDate: minEndDate,
          },
        ],
      }),
      "date"
    );
    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        rows: [],
        totalPercentage: 0,
        saveBtn: false,
      }),
      "rows"
    );
  }

  public onValueHelpRequest(oEvent: any): void {
    const sInputValue = oEvent.getSource().getValue(),
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
    const oBinding = oEvent.getSource().getBinding("items");
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
    const oButton = oEvent.getSource(),
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
    const oButton = this.getView().byId("data");
    this.dateDialog.then(function (dialog: Control | Control[]) {
      (dialog as Dialog).close();
    });
    console.log(oButton);
  }

  onInputChange(): void {
    const oModel: any = this.getView().getModel("rows");
    const aRows = oModel.getProperty("/rows");

    const totalPercentage = aRows.reduce(
      (sum: any, row: any) => sum + parseFloat(row.percentage),
      0
    );
    oModel.setProperty("/totalPercentage", totalPercentage);
    const saveBtn = totalPercentage == 100 ? true : false;
    oModel.setProperty("/saveBtn", saveBtn);
  }

  public addRow() {
    const oModel: any = this.getView().getModel("rows");
    const aRows = oModel.getProperty("/rows");
    const newRow = {
      name: "",
      surname: "",
      percentage: 0,
      enasaraco: "",
      cCIAAProvince: "",
      cCIAANr: "",
      fiscalCode: "",
      locality: "",
    };

    aRows.push(newRow);

    oModel.setProperty("/rows", aRows);
  }

  public onSaveAndExit() {}
  public delete() {
    var oModel: any = this.getView().getModel("rows");
    var aRows = oModel.getProperty("/rows");
    var newRow = {
      name: "",
      surname: "",
      percentage: 0,
      enasaraco: "",
      cCIAAProvince: "",
      cCIAANr: "",
      fiscalCode: "",
      locality: "",
    };
    if (oModel.getData().rows.length === 0) {
      console.log("No data found");
    } else {
      aRows.pop(newRow);
      this.onInputChange()
    }
    oModel.setProperty("/rows", aRows);
  }
}
