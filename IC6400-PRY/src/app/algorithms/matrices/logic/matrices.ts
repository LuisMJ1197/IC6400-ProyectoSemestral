// Para guardar los datos de una dimensión
type D = {
    num: number,
    value: number
};

/**
 * Clase que permite la ejecución del algoritmo para conocer la secuencia de multiplicaciones
 * óptima de matrices.
 */
export class Matrices {
    matrixQ: number;
    dims: D[];
    M: number[][];
    P: number[][];

    constructor(matrixQ: number, dims: D[]) {
        this.matrixQ = matrixQ;
        this.dims = dims;
    }

    /**
     * 1) Básicamente crea la matriz M y P con valores por defecto.
     * 2) Setea los valores triviales e iniciales de la matriz
     * 3) Desde p = 2 (ya que 0 y 1 fueron seteados con valores triviales e iniciales) hasta n
     * 4) Desde i = 0 hasta n - 1 (exclusivo, porque n - 1 es de la diagonal)
     * 5) Seteando a j = i + p sabemos en cual i,j buscar
     *      Con esto obtenemos los k y su valor asociado y podemos seleccionar el mínimo y
     *      actualizar tablas M y R.
     */
    execute() {
        let n: number = this.matrixQ;
        this.M = this.create_matrix(n, n); // 1)
        this.P = this.create_matrix(n, n); // 1)
        for (let i = 0; i < n; i++) { // 2)
            this.M[i][i] = 0
            if (i + 1 < n) {
                this.M[i][i + 1] = this.dims[i].value * this.dims[i + 1].value * this.dims[i + 2].value;
                this.P[i][i + 1] = i + 1;
            }
        }
        for (let p = 2; p < n; p++) { // 3)
            for (let i = 0; i < n - 1; i++) {
                if (i + p < n) {
                    let j = i + p;
                    let k = i;
                    let ks = [];
                    let ks_ = [];
                    while(i <= k && k <= j - 1) {
                        ks.push(this.M[i][k] + this.M[k + 1][j] + (this.dims[i].value * this.dims[j + 1].value * this.dims[k + 1].value));
                        ks_.push(k);
                        k += 1;
                    }
                    this.M[i][j] = this.getMin(ks);
                    this.P[i][j] = ks_[ks.indexOf(this.M[i][j])] + 1;
                }
            }
        }
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

    /**
     * Crea una matriz con "" en los valores de la celda
     * @param n Número de filas
     * @param m Número de columnas
     */
    create_matrix(n: number, m: number) {
        let matrix = [];
        for (let i = 0; i < n; i++) {
            matrix.push(new Array(m).fill(""));
        }
        return matrix;
    }
}
