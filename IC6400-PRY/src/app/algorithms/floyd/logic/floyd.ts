export class Floyd {
    infinite: number = Number.POSITIVE_INFINITY;
    nodesAmount: number;
    adjacencyM: Number[][] = [];
    PMatrix: Number[][] = [];
    DArrays: Array<Number[][]> = new Array();
    PArrays: Array<Number[][]> = new Array();

    constructor(nodesAmount:number, D0Array:Number[][]){
        this.nodesAmount = nodesAmount;
        this.adjacencyM = D0Array;
        this.PMatrix = this.initializeMatrix(0);
    }

    initializeMatrix(value: number){
        let newMatrix: Number[][] = [];
        for(let i = 0; i < this.nodesAmount; i++){
            let row: Number[] = [];
            for(let j = 0; j < this.nodesAmount; j++){
                if(i == j) row.push(0);
                else row.push(value);
            }
            newMatrix.push(row);
        }
        return newMatrix;
    }

    setPMatrix(){
        for(let i = 0; i < this.nodesAmount; i++){
            for(let j = 0; j < this.nodesAmount; j++){
                if(this.adjacencyM[i][j] == this.infinite) this.PMatrix[i][j] = -1;
            }
        }
    }

    copyMatrix(value: number, matrix: Number[][]){
        let newMatrix = this.initializeMatrix(value);
        let rows = matrix.length;
        let columns = matrix[0].length;
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                newMatrix[i][j] = matrix[i][j];
            } 
        }
        return newMatrix;
    }

    execute(){
        this.setPMatrix();
        this.DArrays.push(this.adjacencyM);
        this.PArrays.push(this.PMatrix);
        let DMatrix = this.copyMatrix(this.infinite, this.adjacencyM);
        let PMatrixCopy = this.copyMatrix(0, this.PMatrix);
        for(let k = 0; k < this.nodesAmount; k++){
            for(let i = 0; i < this.nodesAmount; i++){
                for(let j = 0; j < this.nodesAmount; j++){
                    if(DMatrix[i][k].valueOf() + DMatrix[k][j].valueOf() < DMatrix[i][j].valueOf()){
                        DMatrix[i][j] = DMatrix[i][k].valueOf() + DMatrix[k][j].valueOf();
                        PMatrixCopy[i][j] = k+1;
                    }
                }
            }
            this.DArrays.push(this.copyMatrix(this.infinite, DMatrix));
            this.PArrays.push(this.copyMatrix(0, PMatrixCopy));
        }
        this.DArrays.pop();
        this.PMatrix = this.PArrays.pop();
    }

    constructPath(start:number, arrival:number){
        let pathResult:String = "";
        if(this.PMatrix[start][arrival] == 0) pathResult = "Ruta directa";
        else if(this.PMatrix[start][arrival] == -1) pathResult = "No hay ruta";
        else{
            pathResult = (start + 1).toString() + " " + this.constructPathAux(start, arrival);
        }
        return pathResult;
    }

    constructPathAux(start:number, arrival:number){
        if(this.PMatrix[start][arrival] == 0) return (arrival + 1).toString();
        return this.constructPathAux(start, this.PMatrix[start][arrival].valueOf() - 1) + " " + this.constructPathAux(this.PMatrix[start][arrival].valueOf() - 1, arrival);
    }
}
