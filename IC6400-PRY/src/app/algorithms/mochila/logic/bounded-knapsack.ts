import { GeneralKnapsack } from './general-knapsack';

export class BoundedKnapsack extends GeneralKnapsack {
    constructor(T: number[][], X: number[][], n: number, C: number, items: any[]) {
        super(T, X, n, C, items);
    }
    
    calculateValuesWhenFirstObject(i: number, j: number) {
        var x = 1;
        while ((i - (x * Number(this.items[j].value))) >= 0 && x <= this.items[j].quantity) {
            x += 1;	
        }
        this.X[i][j] = x;
        this.T[i][j] = this.items[j].value * x;
    }
}
