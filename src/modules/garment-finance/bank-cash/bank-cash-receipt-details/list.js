import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import numeral from 'numeral';

@inject(Router, Service)
export class List {
	context = ["Detail"];
	columns = [
		{ field: "BankCashReceiptNo", title: "No Kwitansi" },
		{
			field: "BankCashReceiptDate",
			title: "Tanggal Penerimaan",
			formatter: function (value, data, index) {
				return moment.utc(value).local().format('DD MMM YYYY');
			},
		},
	];

	rowFormatter(data, index) {
		if (data.IsPosted)
			return { classes: "success" }
		else
			return {}
	}

	controlOptions = {
		label: {
			length: 4,
		},
		control: {
			length: 4,
		},
	};

	loader = (info) => {
		let order = {};

		if (info.sort)
			order[info.sort] = info.order;
		else
			order["BankCashReceiptDate"] = "desc";

		let arg = {
			page: parseInt(info.offset / info.limit, 10) + 1,
			size: info.limit,
			keyword: info.search,
			order: order,
		};
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
		this.info = {};
		this.selectedItems = [];
	}

	contextCallback(event) {
		let arg = event.detail;
		let data = arg.data;
		switch (arg.name) {
			case "Detail":
				this.router.navigateToRoute('view', { id: data.Id });
				break;
		}
	}

	create() {
		this.router.navigateToRoute('create');
	}

	reset() {
		this.tableList.refresh();
	}

	search() {
		this.error = {};
		this.tableList.refresh();
	}

}