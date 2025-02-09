import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Service, CoreService, PackingInventoryService } from '../service';
import moment from 'moment';

@inject(Service, CoreService, PackingInventoryService)
export class Item {
	@bindable selectedAccount;

	constructor(service, coreService, packingInventoryService) {
		this.service = service;
		this.coreService = coreService;
		this.packingInventoryService = packingInventoryService;
	}

	toggle() {
		if (!this.isShowing)
			this.isShowing = true;
		else
			this.isShowing = !this.isShowing;
	}

	async activate(context) {
		this.context = context;
		this.data = context.data;
		this.error = context.error;
		this.options = context.options;
		this.readOnly = this.options.readOnly;
		this.isCreate = context.context.options.isCreate;
		this.isEdit = context.context.options.isEdit;
		this.itemOptions = {
			error: this.error,
			isCreate: this.isCreate,
			readOnly: this.readOnly,
			isEdit: this.isEdit,
			header: context.context.options.header,
			item: this.data,
		};
		this.header = this.itemOptions.header;

		this.isShowing = false;
		if (this.error && this.error.Details && this.error.Details.length > 0) {
			this.isShowing = true;
		}
		if (this.data) {
			this.selectedAccount = this.data.Account;
		}
	}

	coaView = (coa) => {
		return coa.Code;
	}

	get coaLoader() {
		return (keyword) => {
			let args = {
				size: 10,
				keyword: keyword,
			}

			return this.service.getChartOfAccounts(args).then(result => {
				return result.data;
			});
		}
	}

	async selectedAccountChanged(newValue, oldValue) {
		if (newValue != this.data.Account) {
			this.data.Account = newValue;
			let args = {
				size: 10,
				filter: JSON.stringify({
					"Code": "USD"
				})
			};

			let dataCurrencies = await this.coreService.getCurrencies(args);

			console.log("dataCurrencies", dataCurrencies);
			var check = moment(this.header.BankCashReceiptDate, 'YYYY/MM/DD');

			var month = check.format('M');
			console.log(month);

			let args2 = {
				size: 10,
				filter: JSON.stringify({
					"Month": month,
					"Currency.Id": dataCurrencies.data[0].Id
				})
			};


			let dataIbCurrencies = await this.coreService.getIBCurrencies(args2);
			this.data.Currency = {
				Id: dataCurrencies.data[0].Id,
				Code: dataCurrencies.data[0].Code,
				Rate: dataIbCurrencies.data[0].Rate
			}
		}
	}

	selectedInvoiceChanged(newValue, oldValue) {
		if (newValue.id != this.data.InvoiceId) {
			this.data.InvoiceId = newValue.id;
			this.data.InvoiceNo = newValue.invoiceNo;
			this.data.BuyerAgent = {
				Id: newValue.buyerAgent.id,
				Code: newValue.buyerAgent.code,
				Name: newValue.buyerAgent.name
			};

			let args = {
				size: 10,
				keyword: "USD",
				filter: JSON.stringify({
					"Date": new Date(newValue.pebDate)
				})
			}
			this.coreService.getGarmentCurrencies(args)
				.then(result => {
					let currency = result.data.slice().pop();
					console.log(currency);
					this.data.Currency = {
						Id: currency.Id,
						Code: currency.Code,
						Rate: currency.Rate,
					}
				});

			let dataInvoice = {};
			let totalAmount = 0;
			let isCmt = false;

			this.packingInventoryService.getInvoiceById(newValue.id).then(result => {
				dataInvoice = Object.assign({}, result);

				for (const invoice of dataInvoice.items) {
					if (invoice.cmtPrice > 0) {
						isCmt = true;
					}
					totalAmount += invoice.cmtPrice;
				}
				if (isCmt == false) {
					totalAmount = 0;
					totalAmount = dataInvoice.totalAmount;
				}
				this.data.Amount = totalAmount;
			});
		}
	}

	currencyView = (currency) => {
		return currency.Code;
	}

	get total() {
		if (this.data.Currency && this.data.Amount != 0) {
			return this.data.Amount * this.data.Currency.Rate;
		}
		return 0;
	}

}
