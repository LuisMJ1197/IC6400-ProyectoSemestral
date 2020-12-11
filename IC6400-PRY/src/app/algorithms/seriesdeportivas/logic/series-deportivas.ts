export type Game = {
    home: boolean;
}

export class SeriesDeportivas {
    totalGames: number;
    gamesToWin: number;
    ph: number;
    pr: number;
    qh: number;
    qr: number;
    format: Game[];

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

    execute() {      
        // creating matrix
        let T = [];
        for (let i = 0; i < this.gamesToWin; i++) {
            T.push(new Array(this.gamesToWin).fill(0));
        }
        // Filling 1's and 0's
        for (let i = 0; i < this.gamesToWin; i++) {
            T[i][0] = 0.0
            T[0][i] = 1.0
        }            
        T[0][0] = "-"
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
        return T
    }
}
