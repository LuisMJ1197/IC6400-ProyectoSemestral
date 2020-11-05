import { GeneralKnapsack } from './general-knapsack';

export class UnboundedKnapsack extends GeneralKnapsack {

    constructor(T: number[][], X: number[][], n: number, C: number, items: any[]) {
        super(T, X, n, C, items);
    }

    calculateValuesWhenFirstObject(i: number, j: number) {
        this.X[i][j] = Math.floor(Number(i) / Number(this.items[j].cost));
		this.T[i][j] = this.items[j].value * this.X[i][j];
    }

}
