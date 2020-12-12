export type Game = {
    home: boolean;
}

/**
 * Permite ejecutar un algoritmo para averiguar la probabilidad de que un equipo gane
 * una serie deportiva.
 */
export class SeriesDeportivas {
    totalGames: number;
    gamesToWin: number;
    ph: number;
    pr: number;
    qh: number;
    qr: number;
    format: Game[];

    /**
     * Constructor
     * @param totalGames Juegos totales
     * @param ph Probabilidad de A de ganar en casa
     * @param pr Probabilidad de A de ganar de visita
     * @param format Formato del juego [{home: (false|true)*}]
     */
    constructor(totalGames, ph, pr, format) {
        this.gamesToWin = (totalGames + 1) / 2;
        this.gamesToWin = this.gamesToWin + 1
        this.totalGames = this.gamesToWin * 2 - 1;
        this.ph = ph / 100.0;
        this.pr = pr / 100.0;
        this.qr = 1 - this.ph;
        this.qh = 1 - this.pr;
        this.format = format;
    }

    /**
     * Ejecuta el algoritmo de series deportivas.
     * Para esto crea una matriz T para guardar los resultados.
     * Llena esa matriz con valores iniciales triviales de 1's y 0's 
     *  (cuando un equipo ya gano y cuando un equipo ya perdió)
     * Ejecuta el ciclo principal donde averigua si se juega en casa o no de A y ejecuta las operaciones
     *  necesarias.
     */
    execute() {      
        // creating matrix
        let T = this.createMatrix();
        // Filling 1's and 0's
        this.fillInitialValues(T);
        // Calculating
        for (let i = 1; i < this.gamesToWin; i++) {
            for (let j = 1; j < this.gamesToWin; j++) {
                if (this.format[this.totalGames - i - j - 1].home) {
                    T[i][j] = Math.round((this.ph * T[i - 1][j] + this.qr * T[i][j - 1]) * 10000) / 10000;
                } else {
                    T[i][j] = Math.round((this.pr * T[i - 1][j] + this.qh * T[i][j - 1]) * 10000) / 10000;
                }
            }
        }
        return T;
    }
    
    /**
     * Crea la matriz T con el tamaño necesario
     */
    createMatrix() {
        let T = [];
        for (let i = 0; i < this.gamesToWin; i++) {
            T.push(new Array(this.gamesToWin).fill(0));
        }
        return T;
    }

    /**
     * Rellena los campos triviales de la matriz T.
     * @param T 
     */
    fillInitialValues(T) {
        // Filling 1's and 0's
        for (let i = 0; i < this.gamesToWin; i++) {
            T[i][0] = 0.0
            T[0][i] = 1.0
        }            
        T[0][0] = "-"
    }
}
