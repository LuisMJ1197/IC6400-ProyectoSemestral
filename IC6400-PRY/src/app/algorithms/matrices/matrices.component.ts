import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Matrices } from './logic/matrices';

// Para guardar los datos de una dimension
type D = {
	num: number,
	value: number
};

@Component({
	selector: 'app-matrices',
	templateUrl: './matrices.component.html',
	styleUrls: ['./matrices.component.css']
})

/*
	Esta clase se encargara de la gestión del Componente MatricesComponent
	Principalmente la gestión de la interfaz y captura de datos por parte del usuario.
*/
export class MatricesComponent implements OnInit {
	minMatrixQ: number = 2; // Mínima cantidad de matrices
	matrixQ: number = 2; // Número de matrices
	dimensionList: D[] = [{ num: 0, value: 2 }, { num: 1, value: 2 }, { num: 2, value: 2 }]; // Lista de dimenciones
	M: number[][] = []; // Matriz M del resultado
	P: number[][] = []; // Matriz P del resultado
	tableMView: boolean = true; // Para visualizar o la tabla M o la tabla P
	solutionView: boolean = false; // Para visualizar dimensiones o resultado
	document: any;
	selectedFile: any;

	constructor(@Inject(DOCUMENT) document) {
		this.document = document;
	}

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
		if (file.dimensionList == null) {
			alert("El archivo no tiene el formato correcto.");
		} else if (!Array.isArray(file.dimensionList)) {
			alert("El archivo no tiene el formato correcto.");
		} else if(file.dimensionList.length < 3) {
			alert("El archivo no tiene el formato correcto. Deben de haber mínimo 3 dimensiones.");
		} else {
			this.dimensionList = file.dimensionList;
			this.matrixQ = this.dimensionList.length - 1;
		}
	}

	/*
		Para guardar (descargar) un archivo con la información actual configurada.
		Se guardará un archivo con el nombre matricesdata.json.
	*/
	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				dimensionList: this.dimensionList
			})
		));
		element.setAttribute('download', "matricesdata.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	/**
	 * Aumenta la cantidad de matrices y añade una dimension a la lista de dimensiones
	 */
	addMatrix() {
		this.matrixQ += 1;
		this.dimensionList.push({ num: this.matrixQ, value: 2 });
	}

	/**
	 * Reduce la cantidad de matrices y elimina una dimension de la lista de dimensiones
	 */
	removeMatrix() {
		this.matrixQ -= 1;
		this.dimensionList.pop();
	}

	/**
	 * Valida el valor de una dimension, que esta no sea ""
	 * @param dim Dimension a validar
	 */
	validateDim(dim) {
		if (dim.value == "") {
			dim.value = 2;
		}
	}

	/**
	 * Crea una matriz que se utiliza para iterar en interfaz.
	 */
	getMatrix() {
		return new Array(this.matrixQ).fill('A');
	}

	/**
	 * Crea un html para la visualización de las matrices y los paréntesis
	 */
	getMultiplicationMatrix() {
		return this.getMultiplicationMatrixAux(this.P, 0, this.P.length - 1, true);
	}

	getMultiplicationMatrixAux(P: number[][], i, j, firstCheck) {
		if (i == j) {
        	return `<p style="margin-left: 0.5rem; margin-right: 0.5rem">${"A"}<sub>${i + 1}</sub></p>`;
		} else {
			if (firstCheck) {
				return `<p><p style="color: #FF653C">(</p>${this.getMultiplicationMatrixAux(P, i, P[i][j]-1, false)} <p style="color: #FF653C">)</p>
					<p style="color: #FF653C">(</p>${this.getMultiplicationMatrixAux(P, P[i][j], j, false)}<p style="color: #FF653C">)</p></p>`
			}
			if(i != 0) {
				return `<p><p style="color: #FF653C">(</p>${this.getMultiplicationMatrixAux(P, i, P[i][j]-1, false)}${this.getMultiplicationMatrixAux(P, P[i][j], j, false)}<p style="color: #FF653C">)</p></p>`
			} else {
				return `<p>${this.getMultiplicationMatrixAux(P, i, P[i][j]-1, false)}${this.getMultiplicationMatrixAux(P, P[i][j], j, false)}</p>`
			}
		}
	}

	/**
	 * Ejecuta el algoritmo Matrices enviándole la cantidad de matrices y los datos de las dimensiones
	 * Además, actualiza los datos del componente que ayudarán en su visualización.
	 */
	executeAlgorithm() {
		let alg: Matrices = new Matrices(this.matrixQ, this.dimensionList);
		alg.execute();
		this.M = alg.M;
		this.P = alg.P;
		this.document.getElementById("solution-a").innerHTML = this.getMultiplicationMatrix();
		this.solutionView = true;
	}
}
