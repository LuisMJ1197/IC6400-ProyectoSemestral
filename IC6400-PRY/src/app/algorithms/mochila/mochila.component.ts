import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getMaxListeners } from 'process';

type KObject = {
	id: number,
	cost: number,
	value: number,
	quantity: number,
	selected: boolean
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
	items: KObject[] = [] as KObject[];
	matrix: number[][] = [];
	matrixX: number[][] = [];
	selectedFile: any;
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

		// Creating matrix T
		this.matrix = new Array(this.knapsackSize + 1)
			.fill(new Array(this.items.length).fill(0) as number[]);
		
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
		this.items.push({ id: this.items.length, cost: 0, value: 0, quantity: this.getQuantity(), selected: false} as KObject);
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
		if (this.kind == 0) {
			this.items.forEach((item) => {
				item.quantity = 1;
			});
		} else if (this.kind == 1) {
			this.items.forEach((item) => {
				item.quantity = 1;
			});
		} else {
			this.items.forEach((item) => {
				item.quantity = Infinity;
			});
		}
	}

	executeAlgorithm() {
		var T: number[][] = this.matrix;
		var X: number[][] = this.matrixX;
		var n: number = this.items.length;
		var C: number = this.matrix.length;
		console.log(this.items);
		if (this.kind == 0) {
			this.execute01(T, X, n, C);
		} else {
			this.executeGeneral(T, X, n, C);
		}


	}

	execute01(T: number[][], X: number[][], n: number, C: number) {
		var j: number;
		for (j = 0; j < n; j++) {
			var i: number;
			for (i = 0; i < C; i++) {
				if (i == 0) {
					T[i][j] = 0;
					X[i][j] = 0;
				} else {
					if (j == 0) {
						if ((Number(i) - Number(this.items[j].cost)) >= 0) {
							T[i][j] = this.items[j].value;
							X[i][j] = 1;
						} else {
							T[i][j] = 0;
							X[i][j] = 0;
						}
					} else {
						if ((i - this.items[j].cost) >= 0) {
							var pX = [T[i][j - 1]];
							pX.push(Number(this.items[j].value) + Number(T[i - this.items[j].cost][j - 1]));
							var result = this.getMax(pX);
							T[i][j] = result;
							X[i][j] = pX.indexOf(result);
						} else {
							T[i][j] = T[i][j - 1]
							X[i][j] = 0
						}
					}
				}
			}
		}
		this.getItemsSelected(X);
	}

	executeGeneral(T: number[][], X: number[][], n: number, C: number) {
		var j: number;
		for (j = 0; j < n; j++) {
			var i: number;
			for (i = 0; i < C; i++) {
				if (i == 0) {
					T[i][j] = 0;
					X[i][j] = 0;
				} else {
					if (this.items[j].quantity > 0) {
						if (j == 0) {
							if ((Number(i) - Number(this.items[j].cost)) >= 0) {
								if (this.items[j].quantity == Infinity) {
									X[i][j] = Math.floor(Number(i) / Number(this.items[j].cost));
									T[i][j] = this.items[j].value * X[i][j];
								} else {
									var x = 1;
									while (x <= this.items[j].quantity) {
										x += 1;	
									}
									X[i][j] = x;
									T[i][j] = this.items[j].value * x;
								}
							} else {
								T[i][j] = 0;
								X[i][j] = 0;
							}
						} else {
							// getting possibles x
							var x = 1;
							var pX = [T[i][j - 1]];
							var maxX = this.items[j].quantity;
							while ((i - (x * this.items[j].cost) >= 0) && (x <= maxX || maxX == Infinity)) {
								pX.push(x * Number(this.items[j].value) + Number(T[i - (x * this.items[j].cost)][j - 1]));
								x += 1;
							}
							var result = this.getMax(pX);
							T[i][j] = result;
							X[i][j] = pX.indexOf(result);
						}
					}
				}
			}
		}
		this.getItemsSelected(X);
	}

	getItemsSelected(X: number[][]) {
		var i = X.length - 1;
		var j = this.items.length - 1;
		while(j >= 0) {
			if (X[i][j] != 0) this.items[j].selected = true;
			else this.items[j].selected = false; 
			i = i - X[i][j] * this.items[j].cost;
			j -= 1;
		}
	}

	getMax(arrayL: number[]): number {
		var maxFound = arrayL[0];
		arrayL.forEach((value) => {
			if (value > maxFound) {
				maxFound = value;
			}
		});
		return maxFound;
	}

}
