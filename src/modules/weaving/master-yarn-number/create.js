import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";

@inject(Router, Service)
export class Create {
  // showViewEdit=false;
  // readOnlyViewEdit=true;
  constructor(router, service) {
    this.router = router;
    this.service = service;
    this.data = {};
    this.error = {};
  }

  activate(params) {}

  list() {
    this.router.navigateToRoute("list");
  }

  cancelCallback(event) {
    this.list();
  }

  saveCallback(event) {
    // this.error = {};
    // var index = 0;
    // var emptyFieldName = "Semua Field Harus Diisi";

    // if (this.data.code == null || this.data.code == undefined) {
    //   this.error.code = "Kode Ring Tidak Boleh Kosong";
    //   index++;
    // }
    // if (this.data.number == null || this.data.number == undefined) {
    //   this.error.number = "Ukuran Ring Tidak Boleh Kosong";
    //   index++;
    // }
    // if (index > 0) {
    //   window.alert(emptyFieldName);
    // } else {
      // console.log(this.data);
      // debugger;
      this.service
        .create(this.data)
        .then(result => {
          this.list();
        })
        .catch(e => {
          this.error = e;
        });
    // }
  }
}
