type Key = {
    code: string,
    height: number,
    prob: number
};

type Node = {
    value: number,
    left: Node,
    right: Node
}

export class ArbolesBinarios {
    keys: any[] = [];
    orderedKeys: any[] = [];
    A: number[][];
    R: number[][];

    constructor(keys: any[]) {
        this.keys = keys;
        this.orderedKeys = JSON.parse(JSON.stringify(this.keys)) as Key[];
        this.orderKeys();
        this.getProbs();
    }

    execute() {
        let n: number = this.orderedKeys.length;
        // +2 because we need a row 0 that is not used but need for indexing
        this.A = this.create_matrix(n + 2, n + 1);
        this.R = this.create_matrix(n + 2, n + 1);
        this.init_values(this.orderedKeys, this.A, this.R, n + 1);
        // let p be the differences between k's 1,2 -> p = 2 1,4 -> p = 3
        for (let p = 1; p < n; p++) {
            for (let i = 1; i < n; i++) {
                if (i + p <= n) {
                    let j = i + p;
                    let ks = this.search_ks(this.orderedKeys, this.A, i, j);
                    let chosen = this.getMin(ks);
                    this.A[i][j] = chosen;
                    let chosen_k = ks.indexOf(chosen);
                    this.R[i][j] = chosen_k + i;
                }
            }
        }
        this.A.shift();
        this.R.shift();
    }

    search_ks(keys: any[], A: number[][], i: number, j: number) {
        let ks = []
        let probs_sum = 0;
        for (let k = i; k < j + 1; k++) {
            probs_sum += Number(keys[k - 1].prob);
        }
        for (let k = i; k < j + 1; k++) { // + 2 -> 1 because we have (j - i) + 1 k's... 1 -> because we need it inclusive    
            let res = A[i][k - 1] + A[k + 1][j] + probs_sum;
            res = Math.round(res * 10000.0) / 10000.0;
            ks.push(res);
        }
        return ks
    }

    init_values(keys: any[], A: number[][], R: number[][], n: number) {
        for (let i = 1; i < n; i++) {
            A[i][i - 1] = 0;
            R[i][i - 1] = 0;
            A[i][i] = Number(keys[i - 1].prob);
            R[i][i] = i;
        }
        A[n][n - 1] = 0;
        R[n][n - 1] = 0;
    }

    create_matrix(n: number, m: number) {
        let matrix = [];
        for (let i = 0; i < n; i++) {
            matrix.push(new Array(m).fill(""));
        }
        return matrix;
    }

    orderKeys() {
        this.orderedKeys.sort((a, b) => {
            if (a === b) {
                return 0;
            }
            return a.code < b.code ? -1 : 1;
        });
    }

    getProbs() {
        let allHeights = 0;
        this.orderedKeys.forEach(key => allHeights += Number(key.height));
        this.orderedKeys.forEach(key => {
            key.prob = Math.round((Number(key.height) / allHeights) * 10000.0) / 10000.0;
        });
    }

    /**
     * Obtiene el mínimo valor en un arreglo de enteros.
     * @param arrayL Arreglo de enteros.
     */
    getMin(arrayL: number[]): number {
        var min = arrayL[0];
        arrayL.forEach((value) => {
            if (Number(value) < Number(min)) {
                min = value;
            }
        });
        return min;
    }

    getBinaryTreeArray(RTable: number[][]) {
        let root = RTable[0][RTable[0].length - 1];
        let tree = {
            value: root,
            left: this.getBinaryTreeArrayAux(RTable, 1, root - 1),
            right: this.getBinaryTreeArrayAux(RTable, root + 1, RTable.length - 1)
        } as Node;
        return tree;
    }

    getBinaryTreeArrayAux(RTable, i, j) {
        let newK = RTable[i - 1][j];
        if (newK == 0) {
            return null;
        }
        let node = {
            value: newK,
            left: this.getBinaryTreeArrayAux(RTable, i, newK - 1),
            right: this.getBinaryTreeArrayAux(RTable, newK + 1, j)
        }
        return node;
    }
}
