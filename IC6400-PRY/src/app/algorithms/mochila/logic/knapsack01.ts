import { GeneralKnapsack } from './general-knapsack';

export class Knapsack01 extends GeneralKnapsack {
    
    constructor(T: number[][], X: number[][], n: number, C: number, items: any[]) {
        super(T, X, n, C, items);
    }

    calculateValuesWhenFirstObject(i: number, j: number) {
        this.T[i][j] = this.items[j].value;
		this.X[i][j] = 1;
    }

    calculateValuesWhenNotFirstObject(i: number, j: number) {
        if ((i - this.items[j].cost) >= 0) {
            var pX = [this.T[i][j - 1]];
            pX.push(Number(this.items[j].value) + Number(this.T[i - this.items[j].cost][j - 1]));
            var result = this.getMax(pX);
            this.T[i][j] = result;
            this.X[i][j] = pX.indexOf(result);
        } else {
            this.T[i][j] = this.T[i][j - 1];
            this.X[i][j] = 0;
        }
    }
}
