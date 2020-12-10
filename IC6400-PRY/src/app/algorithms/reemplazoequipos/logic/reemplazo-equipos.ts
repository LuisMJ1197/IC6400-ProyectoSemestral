export class ReemplazoEquipos {
    data: any;
    term: number;
    lifeSpan: number;
    isGainActivated: boolean = false;
    initialCost: number;

    constructor(data: any, term: number, lifeSpan: number, initialCost: number, isGainActivated: boolean) {
        this.data = data;
        this.term = Number(term);
        this.lifeSpan = Number(lifeSpan);
        this.isGainActivated = isGainActivated;
        this.initialCost = Number(initialCost);
    }

    execute() {
        // k es la diferencia entre t y x
        let K = this.buscar_valores_k(this.data, this.lifeSpan, this.initialCost);
        // print(K)
        let G_List = new Array(this.term + 1).fill(0);
        let K_List = new Array(this.term + 1).fill([]);
        let pos = this.term - 1;
        while(pos >= 0) {
            G_List[pos] = this.G(G_List, K_List, this.lifeSpan, pos, K, this.term);
            pos -= 1
        }
        // print(K_List)
        let result = this.createResult(G_List, K_List);
        return result;
    }

    G(G_List, K_List, vida_util, pos, K_list, tiempo) {
        var k_list = [];
        var k = 1
        while (k <= vida_util && pos + k <= tiempo) {
            k_list.push(K_list[k - 1] + G_List[pos + k])
            k += 1
        }
        var res = this.getMin(k_list)
        K_List[pos] = this.get_indexes(k_list, res, pos)
        return res
    }

    get_indexes(list_, value, pos) {
        var res = []
        for (let i = 0; i < list_.length; i++) {
            if (list_[i] == value) {
                res.push(pos + i + 1)
            }
        }
        return res
    }

    buscar_valores_k(datos, vida_util, valor_nuevo) {
        let K = [];
        for (let k = 0; k < vida_util; k++) {
            let newK = valor_nuevo;
            for (let i = 0; i < k + 1; i++) {
                newK += Number(datos[i].maintenance);
                newK -= Number(datos[i].gain); // Uncomment if gain is not accumulative
            }
            newK -= Number(datos[k].resale);
            K.push(newK);
        }
        return K
    }

    createResult(G_List, K_List) {
        let result = [];
        for (let i = 0; i < G_List.length; i++) {
            result.push([i, G_List[i], K_List[i]]);
        }
        return result;
    }

    getPlans(G_List) {
        let result = [];
        this.getPlansAux(G_List, 0, result, []);
        return result;
    }

    getPlansAux(G_list, pos, result, path) {
        path.push(pos);
        if (G_list[pos][2].length > 0) {
            G_list[pos][2].forEach(next => {
                this.getPlansAux(G_list, next, result, path.slice());
            });
        } else {
            result.push(path);
        }
    }

    getMin(arrayL: number[]): number {
        var min = arrayL[0];
        arrayL.forEach((value) => {
            if (Number(value) < Number(min)) {
                min = value;
            }
        });
        return min;
    }
}
