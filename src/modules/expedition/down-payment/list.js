import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {
  dataToBePosted = [];

  rowFormatter(data, index) {
    if (data.isPosted)
      return { classes: "success" }
    else
      return {}
  }

  context = ["Detail", "Cetak Bukti Pembayaran"]

  columns = [
    { field: "DocumentNo", title: "No. Bukti Pembayaran" },
    { field: "BuyerName", title: "Buyer" },
    {
      field: "DatePayment", title: "Tanggal Pembayaran", formatter: function (value, data, index) {
        return moment(value).format("DD MMM YYYY");
      }
    },
    { field: "CurrencyCode", title: "Kurs" },
    { field: "TotalPayment", title: "Jumlah Pembayaran" }
  ];

  loader = (info) => {
    var order = {};
    if (info.sort)
      order[info.sort] = info.order;

    var arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      order: order
    }

    return this.service.search(arg)
      .then(result => {
        return {
          total: result.info.total,
          data: result.data
        }
      });
  }

  constructor(router, service) {
    this.service = service;
    this.router = router;
  }

  contextClickCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "Detail":
        this.router.navigateToRoute('view', { id: data.Id });
        break;
      case "Cetak Bukti Pembayaran":
        this.service.getSalesReceiptPdfById(data.Id);
        break;
    }
  }

  contextShowCallback(index, name, data) {
    switch (name) {
      case "Cetak Bukti Pembayaran":
        return data;
      default:
        return true;
    }
  }

  create() {
    this.router.navigateToRoute('create');
  }
}
