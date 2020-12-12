import { Component, OnInit } from '@angular/core';
import { ReemplazoEquipos } from './logic/reemplazo-equipos';

export type LifeSpan = {
	year: number,
	resale: number,
	maintenance: number,
	gain: number
}

@Component({
	selector: 'app-reemplazoequipos',
	templateUrl: './reemplazoequipos.component.html',
	styleUrls: ['./reemplazoequipos.component.css']
})

/*
	Esta clase se encargara de la gestión del Componente ReemplazequiposComponent
	Principalmente la gestión de la interfaz y captura de datos por parte del usuario.
*/
export class ReemplazoequiposComponent implements OnInit {
	initialCost: number = 0; // Costo inicial del equipo
	maxTerm: number = 30; // Máxima cantidad de años del proyecto
	term: number = 1; // Cantidad de años del proyecto
	maxLifeSpan: number = 10; // Máxima vida útil del equipo
	lifeSpan: number = 1; // Vida útil del equipo
	lifeSpans: LifeSpan[] = [ 
		{
			year: 1,
			resale: 0,
			maintenance: 0,
			gain: 0
		}
	]; // Lista de datos de el año, reventa, mantenimiento y ganancia
	isGainActivated: boolean = false; // Para manejar si se quiere incluir ganancias
	selectedFile: any; // Archivo seleccinado
	solutionMatrix: number[][] = [
		[0, 0, 0],
		[1, 0, 0]
	]; // Matriz de solución, inicialmente se usa para dar un preview de la matriz solución
	plans: number[][] = []; // Para guardar los planes que se extraen de la matriz solución

	constructor() {}

	ngOnInit(): void {
	}

	/*
		Para manejar el evento de seleccionar un archivo.
	*/
	onFileSelect(event) {
		this.selectedFile = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = reader.result.toString().trim();
			const file = JSON.parse(text);
			this.loadFile(file);
		}
		reader.readAsText(this.selectedFile);
	}

	/*
		Para cargar los datos de un archivo en la interfaz del componente.
	*/
	loadFile(file) {
		this.term = file.term;
		this.lifeSpan = file.lifeSpan;
		this.initialCost = file.initialCost;
		this.isGainActivated = file.isGainActivated;
		this.lifeSpans = [];
		file.lifeSpans.forEach(element => {
			this.lifeSpans.push(
				{
					year: element.year,
					resale: element.resale,
					maintenance: element.maintenance,
					gain: element.gain
				}
			)
		});
	}

	/*
		Para guardar (descargar) un archivo con la información actual configurada.
		Se guardará un archivo con el nombre reemplazodata.json.
	*/
	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				"term": this.term,
				"lifeSpan": this.lifeSpan,
				"initialCost": this.initialCost,
				"isGainActivated": this.isGainActivated,
				"lifeSpans": this.lifeSpans
			})
		));
		element.setAttribute('download', "reemplazodata.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	/*
		Añade un año (unidad) a la cantidad de años del proyecto
	*/
	addTerm() {
		this.term += 1;
		this.solutionMatrix.push([this.term, 0, 0]);
	}

	/*
		Elimina un año (unidad) a la cantidad de años del proyecto
	*/
	removeTerm() {
		this.term -= 1;
		this.solutionMatrix.pop();
	}

	/*
		Valida que el costo inicial del equipo (recibido como parámetro) no sea algo vacío, en este caso un string
		porque el componente gráfico envío el valor como string.
		Si es así, se establece el costo inicial del equipo en 0.
		Entradas:
			cost: costo inicial del equipo
	*/
	validateCost(cost) {
		if (cost == "") {
			this.initialCost = 0;
		}
	}

	/*
		Valida la cantidad de años del proyecto para que esta no exceda los límites (ni mayor ni menor)
		y además que sea un dato de entrada válido (no vacío el string)
		Entradas:
			term: cantidad de años del proyecto
	*/
	validateTerm(term) {
		if (!(Number(term) <= this.maxTerm)) {
			this.term = this.maxTerm;
		} else if (term == "" || term == 0) {
			this.term = 1;
		}
		this.solutionMatrix = [] 
		for(let i = 0; i < this.term + 1; i++) {
			this.solutionMatrix.push([i, 0, 0]);
		}
	}

	/**
	 * Valida la vida útil del equipo para que este no exceda los límites (ni mayor ni menor)
	 * y además que sea un dato de entrada válido (no vacío el string)
	 * @param lifeSpan 
	 */
	validateLifeSpan(lifeSpan) {
		if (!(Number(lifeSpan) <= this.maxLifeSpan)) {
			this.lifeSpan = this.maxLifeSpan;
		} else if (lifeSpan == "" || lifeSpan == 0) {
			this.lifeSpan = 1;
		}
		this.lifeSpans = [];
		for (let i = 0; i < this.lifeSpan; i++) {
			this.lifeSpans.push({
				year: i+1,
				resale: 0,
				maintenance: 0,
				gain: 0
			});
		}
	}

	/**
	 * Añade un año de vida al equipo.
	 */
	addLifeSpan() {
		this.lifeSpan += 1;
		this.lifeSpans.push({
			year: this.lifeSpan,
			resale: 0,
			maintenance: 0,
			gain: 0
		} as LifeSpan);
	}

	/**
	 * Elimina un año de vida al equipo
	 */
	removeLifeSpan() {
		this.lifeSpan -= 1;
		this.lifeSpans.pop();
	}

	/**
	 * Ejecuta el algoritmo al invocar a la clase correspondiente, en este caso ReemplazoEquipos envíandole
	 * la configuración de mantenimiento, reventa y ganancia, los años del proyecto, el costo inicial
	 * del equipo y si se requieren añadir ganancias.
	 */
	executeAlgorithm() {
		let alg = new ReemplazoEquipos(this.lifeSpans, this.term, this.lifeSpan, this.initialCost, this.isGainActivated);
		this.solutionMatrix = alg.execute();
		this.plans = alg.getPlans(this.solutionMatrix);
	}

}
