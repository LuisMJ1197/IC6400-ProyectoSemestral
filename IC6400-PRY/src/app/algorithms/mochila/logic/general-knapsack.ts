export abstract class GeneralKnapsack {
    T: number[][];
    X: number[][];
    n: number;
    C: number;
    items: any[];

    constructor(T: number[][], X: number[][], n: number, C: number, items: any[]) {
        this.T = T;
        this.X = X;
        this.n = n;
        this.C = C;
        this.items = items;
    }

    execute() {
        var j: number;
        // For j = 0 to N -1 -> Todos los objetos hasta el último
		for (j = 0; j < this.n; j++) {
            // For i = 0 to C - 1 -> Todos las capacidades hasta la máxima
            var i: number;
			for (i = 0; i < this.C; i++) {
                if (this.items[j].cost > 0 && this.items[j].value > 0) { // We need value and cost
                    if (i == 0) { // Si es la capacidad 0 no puedo llevar nada
                        this.T[i][j] = 0;
                        this.X[i][j] = 0;
                    } else { // Si la capacidad es mayor a 0 (nunca será menor)
                        if (this.items[j].quantity > 0) { // If there is objects of this kind
                            if (j == 0) { // Si estamos en la columna 0, es decir, primer objeto
                                if ((i - this.items[j].cost) >= 0) { // Si me alcanza el costo del objeto actual con la capacidad que estoy analizando
                                    this.calculateValuesWhenFirstObject(i, j); // Se calcula cuántos se puede llevar según la capacidad y la cantidad de objetos
                                } else { // Si no me alcanza no puedo llevar
                                    this.T[i][j] = 0;
                                    this.X[i][j] = 0;
                                }
                            } else { // Si no es la primera columna
                                this.calculateValuesWhenNotFirstObject(i, j);
                            }
                        }
                    }
                } else {
                    this.T[i][j] = 0;
                    this.X[i][j] = 0;
                }
            }
        }
    }

    abstract calculateValuesWhenFirstObject(i: number, j: number);

    calculateValuesWhenNotFirstObject(i: number, j: number) {
        // getting possibles x
        var x = 1;
        var pX = [this.T[i][j - 1]];
        var maxX = this.items[j].quantity;
        while ((i - (x * this.items[j].cost) >= 0) && (x <= maxX || maxX == Infinity)) {
            pX.push(x * Number(this.items[j].value) + Number(this.T[i - (x * this.items[j].cost)][j - 1]));
            x += 1;
        }
        var result = this.getMax(pX);
        this.T[i][j] = result;
        this.X[i][j] = pX.indexOf(result);
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
