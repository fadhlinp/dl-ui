import { Router } from 'aurelia-router';
import { Service } from './service';
import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Dialog } from '../../../../au-components/dialog/dialog';
const KwitansiLoader = require('../../../../loader/garment-finance-bank-cash-receipt-loader');
import moment from 'moment';

@inject(Router, Service, Dialog)
export class DataForm {
	@bindable title;
	@bindable readOnly;
	@bindable data = {};
	@bindable error = {};
	@bindable selectedKwitansi;

	formOptions = {
		cancelText: "Kembali",
		saveText: "Simpan",
		deleteText: "Hapus",
		editText: "Ubah",
	}


	itemsColumns = [
		{ header: "No Invoice" },
		{ header: "Kode Buyer" },
		{ header: "Nama Buyer" },
		{ header: "Kurs" },
		{ header: "Rate" },
		{ header: "Jumlah" },
		{ header: "Total IDR" },
		{ header: "" },
	]

	othersColumns = [
		{ header: "No Account" },
		{ header: "Nama Account" },
		{ header: "Kurs" },
		{ header: "Rate" },
		{ header: "Jumlah" },
		{ header: "Total IDR" },
		{ header: "" },
	]





	constructor(router, service, dialog) {
		this.router = router;
		this.service = service;
		this.dialog = dialog;
	}

	bind(context) {
		this.context = context;
		this.data = this.context.data;
		this.error = this.context.error;
		this.cancelCallback = this.context.cancelCallback;
		this.deleteCallback = this.context.deleteCallback;
		this.editCallback = this.context.editCallback;
		this.saveCallback = this.context.saveCallback;
		this.Options = {
			isCreate: this.context.isCreate,
			isView: this.context.isView,
			isEdit: this.context.isEdit,
			header: this.data
		}
		if (this.data) {
			this.selectedKwitansi = {
				Id: this.data.BankCashReceiptId,
				ReceiptNo: this.data.BankCashReceiptNo,
				ReceiptDate: this.data.BankCashReceiptDate,
			};
		}
	}

	get addItems() {
		return (event) => {
			this.data.Items.push({});

		};
	}

	get removeItems() {
		return (event) => {
			this.error = null;
		};
	}

	get addOtherItems() {
		return (event) => {
			this.data.OtherItems.push({});

		};
	}

	get removeOtherItems() {
		return (event) => {
			this.error = null;
		};
	}


	get kwitansiLoader() {
		return KwitansiLoader;
	}

	kwitansiView = (kwitansi) => {
		return kwitansi.ReceiptNo;
	}

	selectedKwitansiChanged(newValue, oldValue) {
		this.data.BankCashReceiptNo = newValue.ReceiptNo;
		this.data.BankCashReceiptId = newValue.Id;
		this.data.BankCashReceiptDate = newValue.ReceiptDate;
	}


}
