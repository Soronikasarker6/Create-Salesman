import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v4/Context";
import Component from "sap/ui/core/Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import ComboBox from "sap/m/ComboBox";
import ClusterGrid from "sap/ui/vbm/ClusterGrid";

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
        saveBtn: true,
      }),
      "rows"
    );
    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        sf: [
          {
            id:1,
            fq:"fq1"
          },
          {
            id:2,
            fq:"fq2"
          }
        ],
        relationship: [
          {
            id:1,
            tr:"tr1"
          },
          {
            id:2,
            tr:"tr2"
          }
        ],
        settlementCurrency: [
          {
            id:1,
            sc:"USD"
          },
          {
            id:2,
            sc:"BDT"
          }
        ],
        salesmanType: [
          {
            id:1,
            st:"A"
          },
          {
            id:2,
            st:"B"
          }
        ],
        collaboratorType: [
          {
            id:1,
            ct:"ct1"
          },
          {
            id:2,
            ct:"ct2"
          }
        ],
        settlementForm: [
          {
            id:1,
            sf:"sf1"
          },
          {
            id:2,
            sf:"sf2"
          }
        ],
        sectorActivity: [
          {
            id:1,
            sa:"sa1"
          },
          {
            id:2,
            sa:"sa2"     
          }
        ],
        sendingMethod:[
          {
            id:1,
            sm:"sm1"
          },
          {
            id:2,
            sm:"sm2"    
          }
        ],
      }),
      "master"
    );

    const startDate = new Date().toISOString().split("T")[0] as string;

    (this.getOwnerComponent() as Component).setModel(
      new JSONModel({
        startDate: startDate,
        endDate: this.endDate,
        accounting: false,
        preInvoice: true,
        supplier: false,
        settlementFrequency: "",
        relationship: "",
        settlementCurrency: "",
        salesmanType: "",
        collaboratorType: "",
        settlementForm: "",
        sectorActivity: "",
        sendingMethod: "",
      }), "selectedValues"
    )
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
    const saveBtn =(( totalPercentage == 100 )|| oModel.getData().rows.length === 0)? true : false;
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
date(){
  console.log("sss")
}

  public onSaveAndExit() {
    const selectedSettlementFrequency = this.getView().getModel("selectedValues");

    // Log the selected data
    console.log(selectedSettlementFrequency.getData());

  }
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
