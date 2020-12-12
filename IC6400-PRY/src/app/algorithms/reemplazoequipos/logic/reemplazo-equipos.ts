/**
 * Esta clase permitirá la ejecución del algoritmo de reemplazo de equipos.
 */
export class ReemplazoEquipos {
    /* 
        Datos de mantenimiento, reventa y ganancia con el formato [{year: number, resale: number, maintenance: number, gain: number}]
    */
    data: any;
    term: number; // Plazo del proyecto
    lifeSpan: number; // Vida útil del equipo
    isGainActivated: boolean = false; // Si se requiere incluir ganancia
    initialCost: number; // Costo inicial del equipo

    /**
     * 
     * @param data Datos de mantenimiento, reventa y ganancia con el formato [{year: number, resale: number, maintenance: number, gain: number}]
     * @param term Plazo del proyecto
     * @param lifeSpan Vida útil del equipo
     * @param initialCost Costo inicial del equipo
     * @param isGainActivated Si se requiere incluir ganancia
     */
    constructor(data: any, term: number, lifeSpan: number, initialCost: number, isGainActivated: boolean) {
        this.data = data;
        this.term = Number(term);
        this.lifeSpan = Number(lifeSpan);
        this.isGainActivated = isGainActivated;
        this.initialCost = Number(initialCost);
    }

    /**
     * Inicia la ejecución del algoritmo.
     * Primero averigua los Ctx
     * Luego crea G_List, para la creación de la matriz resultado,
     *  con tamaño de term + 1 por el hecho de que se empieza en el instante 0.
     * Luego crea K_List donde se guardarán los K's elegidos en cada iteración (instante)
     *  con tamaño de term + 1 por el hecho de que se empieza en el instante 0.
     * Luego el ciclo conocido por cada instante t se calculará G(t) que en este caso se le envían más datos por referencia
     *  para que pueda realizar los cálculos sobre ellos.
     * Luego se calcula el resultado, que realmente lo que realiza una mezcla entre los resultados de G_List
     * y K_List para cada instante.
     */
    execute() {
        // Averigua los Ctx
        let Ctx_list = this.buscar_valores_k(this.data, this.lifeSpan, this.initialCost);

        let G_List = new Array(this.term + 1).fill(0);
        let K_List = new Array(this.term + 1).fill([]);
        let pos = this.term - 1;
        while(pos >= 0) {
            G_List[pos] = this.G(G_List, K_List, this.lifeSpan, pos, Ctx_list, this.term);
            pos -= 1;
        }
        let result = this.createResult(G_List, K_List);
        return result;
    }

    /**
     * Calcula los valores K para un instante t.
     * @param G_List Lista de G(t) anteriores
     * @param K_List Lista de K's anteriores
     * @param vida_util Vida util del equipo
     * @param pos Posición actual del instante
     * @param K_list Ctx lista
     * @param plazo Plazo del proyecto
     */
    G(G_List, K_List, vida_util, pos, Ctx_list, plazo) {
        var k_list = [];
        /* G(t) = min {Ctx + G(x)} */
        // Todo k desde 1 hasta la vida util del equipo y menor al plazo del proyecto
        var k = 1
        while (k <= vida_util && pos + k <= plazo) {
            k_list.push(Ctx_list[k - 1] + G_List[pos + k])
            k += 1
        }
        var res = this.getMin(k_list)
        K_List[pos] = this.get_indexes(k_list, res, pos)
        /* -- */
        return res
    }

    /**
     * Lo que hace es averiguar los instantes de los valores k mínimos encontrados en la función G(t)
     * Para evalúa el índice en la lista de k's a partir de la posición (instante t) que se está 
     * analizando.
     * @param list_ Lista de k's encontrados en la iteración
     * @param value valor mínimo encontrado
     * @param pos Posición actual o instante t
     */
    get_indexes(list_, value, pos) {
        var res = []
        for (let i = 0; i < list_.length; i++) {
            if (list_[i] == value) {
                res.push(pos + i + 1)
            }
        }
        return res
    }

    /**
     * Averigua todos los Ctx iniciales para saber el costo de comprar un equipo en el insante t
     * y venderlo en el x
     * @param datos datos de mantenimieno, reventa y ganancia
     * @param vida_util vida útil del equipo
     * @param valor_nuevo costo inicial del equipo
     */
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

    /**
     * Realiza la combinación de los costos G_list y los instantes siguientes en el plan K_List
     * @param G_List Costos G(t)
     * @param K_List Instantes siguientes
     */
    createResult(G_List, K_List) {
        let result = [];
        for (let i = 0; i < G_List.length; i++) {
            result.push([i, G_List[i], K_List[i]]);
        }
        return result;
    }

    /**
     *  A partir de una tabla de análisis generada por el algoritmo, se calculan los planes a seguir
     *  según las diferentes opciones que se pueden generar al haber k's mínimos empatados.
     * @param analisisTable tabla de análisis
     */
    getPlans(analisisTable) {
        let result = [];
        this.getPlansAux(analisisTable, 0, result, []);
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
}
