import { Component, OnInit } from '@angular/core';
import { BoundedKnapsack } from './logic/bounded-knapsack';
import { Knapsack01 } from './logic/knapsack01';
import { UnboundedKnapsack } from './logic/unbounded-knapsack';

export type KObject = {
	id: number,
	cost: number,
	value: number,
	quantity: number,
	selected: boolean,
	count: number
}

@Component({
	selector: 'app-mochila',
	templateUrl: './mochila.component.html',
	styleUrls: ['./mochila.component.css']
})

export class MochilaComponent implements OnInit {
	kind: number = 0;
	maxKnapsackSize: number = 20;
	knapsackSize: number = 0;
	maxItemCount: number = 10;
	items: KObject[] = [{ 
		id: 0, 
		cost: 0, 
		value: 0, 
		quantity: this.getQuantity(), 
		selected: false,
		count: 0
	} as KObject] as KObject[];
	matrix: number[][] = [];
	matrixX: number[][] = [];
	selectedFile: any;
	listView: boolean = true;

	constructor() {
	}

	ngOnInit(): void {
	}

	onFileSelect(event) {
		this.selectedFile = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = reader.result.toString().trim();
			const file = JSON.parse(text);
			this.loadFile(file);
		}
		reader.readAsText(this.selectedFile);
	}

	loadFile(file) {
		this.knapsackSize = file.knapsackSize;
		this.items = file.items;
		this.kind = file.kind;
		// Updating items to not-selected
		this.items.forEach((item) => {
			item.selected = false;
			if (item.quantity == null) item.quantity = Infinity;
			item.count = 0;
		});
		// Creating matrix T
		this.matrix = [];
		this.matrixX = [];
		var i: number = 0;
		for (i = 0; i < this.knapsackSize + 1; i++) {
			this.matrix.push(new Array(this.items.length).fill(0) as number[]);
			this.matrixX.push(new Array(this.items.length).fill(0) as number[]);
		}
	}

	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				"kind": this.kind,
				"knapsackSize": this.knapsackSize,
				"items": this.items
			})
		));
		element.setAttribute('download', "knapsackdata.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	addCapacity() {
		if (this.knapsackSize == 0) {
			this.matrix.push(new Array(this.items.length).fill(0) as number[]);
			this.matrixX.push(new Array(this.items.length).fill(0) as number[]);
		}
		this.knapsackSize += 1;
		this.matrix.push(new Array(this.items.length).fill(0) as number[]);
		this.matrixX.push(new Array(this.items.length).fill(0) as number[]);
	}

	removeCapacity() {
		this.matrix.pop();
		this.matrixX.pop();
		this.knapsackSize -= 1;
		if (this.matrix.length == 1) {
			this.matrix.pop();
			this.matrixX.pop();
		}
	}

	addItem() {
		this.items.push({ 
			id: this.items.length, 
			cost: 0, 
			value: 0, 
			quantity: this.getQuantity(), 
			selected: false,
			count: 0
		} as KObject);
		this.matrix.forEach((row) => {
			row.push(0);
		});
		this.matrixX.forEach((row) => {
			row.push(0);
		});
	}

	getQuantity(): number {
		return this.kind == 0 || this.kind == 1 ? 1 : Infinity;
	}

	removeItem() {
		this.items.pop();
		this.matrix.forEach((row) => {
			row.pop();
		});
		this.matrixX.forEach((row) => {
			row.pop();
		});
	}

	changeKind() {
		var quantity = this.kind != 2 ? 1 : Infinity;
		this.items.forEach((item) => {
			item.quantity = quantity;
		});
	}

	executeAlgorithm() {
		var T: number[][] = this.matrix;
		var X: number[][] = this.matrixX;
		var n: number = this.items.length;
		var C: number = this.matrix.length;
		if (this.kind == 0) {
			new Knapsack01(T, X, n, C, this.items).execute();
		} else if (this.kind == 1) {
			new BoundedKnapsack(T, X, n, C, this.items).execute();
		} else {
			new UnboundedKnapsack(T, X, n, C, this.items).execute();
		}
		this.getItemsSelected(X);
	}

	getItemsSelected(X: number[][]) {
		var i = X.length - 1;
		var j = this.items.length - 1;
		while(j >= 0) {
			this.items[j].selected = X[i][j] != 0;
			this.items[j].count = X[i][j];
			i = i - X[i][j] * this.items[j].cost;
			j -= 1;
		}
	}

	validateCost(item) {
		if (item.cost == "") {
			item.cost = 0;
		}
	}

	validateValue(item) {
		if (item.value == "") {
			item.value = 0;
		}
	}
	validateQuantity(item) {
		if (item.quantity == "") {
			item.quantity = this.kind != 2 ? 1 : Infinity;
		}
	}
}
