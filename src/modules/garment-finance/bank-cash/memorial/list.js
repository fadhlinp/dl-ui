import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {

    context = ["Detail"]//, "Cetak"]

    columns = [
        { field: "MemorialNo", title: "No Memorial" },
        {
            field: "Date", title: "Tanggal", formatter: function (value) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "AccountingBookType", title: "Kode Buku" },
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
                for(var a of result.data){
                    a.AccountingBookType= a.AccountingBookCode + " - " + a.AccountingBookType;
                }
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
            case "Cetak":
                this.service.getPdfById(data.Id);
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}
