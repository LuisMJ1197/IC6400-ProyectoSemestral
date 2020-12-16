import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ArbolesBinarios } from './logic/arboles-binarios';

// Para guardar los datos de cada llave
export type Key = {
	code: string,
	height: number,
	prob: number
};

// Para crear una estructura de árbol
type Node = {
    value: number,
    left: Node,
    right: Node
}

@Component({
	selector: 'app-arbolesbinarios',
	templateUrl: './arbolesbinarios.component.html',
	styleUrls: ['./arbolesbinarios.component.css'],
	encapsulation: ViewEncapsulation.None,
})

/*
	Esta clase se encargara de la gestión del Componente ArbolesBinarios
	Principalmente la gestión de la interfaz y captura de datos por parte del usuario.
*/
export class ArbolesbinariosComponent implements OnInit {
	selectedFile: any;
	keyQ: number = 1; // Cantidad de llaves
	maxKeyQ: number = 10; // Máxima cantidad de llaves
	keys: Key[] = [{code: "Key1", height: 0, prob: 0}]; // Lista de llaves
	orderedKeys: Key[] = []; // Lista de llaves ordenadas
	A: number[][] = []; // Matriz A de la solución
	R: number[][] = []; // Matriz B de la solución
	orderView: boolean = false; // Para cambiar la vista izquierda de si es ordenada o no
	tableAView: boolean = true; // Para cambiar la vista entre tabla A y tabla B
	treeView: boolean = false; // Para cambiar la vista entre tablas y árbol binario
	binaryTree: Node = {value: 0, left: null, right: null}; // Nodo raíz de la estructura árbol
	document: any;

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
		if (file.keys == null) {
			alert("El archivo no tiene el formato correcto.");
		} else {
			this.keys = file.keys;
			this.keyQ = this.keys.length;
		}
	}

	/*
		Para guardar (descargar) un archivo con la información actual configurada.
		Se guardará un archivo con el nombre arbolesdata.json.
	*/
	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				keys: this.keys
			})
		));
		element.setAttribute('download', "arbolesdata.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	/**
	 * Añade una llave a la lista de llaves, con valores por defecto
	 */
	addKey() {
		this.keyQ += 1;
		this.keys.push({code: "Key".concat(this.keyQ.toString()), height: 0, prob: 0} as Key);
	}

	/**
	 * Elimina una llave de la lista de llaves, la última.
	 */
	removeKey() {
		this.keyQ -= 1;
		this.keys.pop();
	}

	/**
	 * Valida los datos ingresados en el peso de una llave (que este no sea vacío)
	 * @param key llave a verificar
	 */
	validateHeight(key) {
		if (key.height == "") {
			key.height = 0;
		}
	}

	/**
	 * Valida los datos ingresados en el código de una llave (que este no sea vacío)
	 * @param key llave a verificar
	 */
	validateCode(key) {
		if (key.code == "") {
			key.code = "Key" + (this.keys.indexOf(key) + 1);
		}
	}

	/**
	 * Crea código html para colocar un nodo dentro de una estructura de árbol, además,
	 * realiza llamadas recursivas para repetir el mismo procesos con los hijos izquierdo
	 * y derecho, si tiene
	 * @param node 
	 */
	getNodeHTML(node: Node) {
		if (node != null) {
			return `
				<a href="#">${this.keys[node.value - 1].code}</a>
				${node.left == null && node.right == null ? `` : 
					`
						<ul>
							${node.left == null ? `` :
								`
									<li>
									${this.getNodeHTML(node.left)}
									</li>	
								`
							}
							${node.right == null ? `` :
								`
									<li>
									${this.getNodeHTML(node.right)}
									</li>	
								`
							}
						</ul>
					`
				}				
			`;
		} else {
			return ``;
		}
	}

	/**
	 * Empieza la creación de html de los nodos de un árbol.
	 */
	createTreeHTML() {
		let html = `
			<ul>
				<li>
					${this.getNodeHTML(this.binaryTree)}
				</li>
			</ul>
		`;
		document.getElementById("binarytree").innerHTML = html;
	}

	/**
	 * Ejecuta el algoritmo de ArbolesBinarios enviándole la lista de llaves con su 
	 * respectiva información.
	 * Luego actualiza los datos del componente que servirán para actualizar la interfaz.
	 */
	executeAlgorithm() {
		console.log(this.keys);
		if(this.keyQ > 0) {
			let alg: ArbolesBinarios = new ArbolesBinarios(this.keys);
			alg.execute();
			this.orderedKeys = alg.orderedKeys;
			this.A = alg.A;
			this.R = alg.R;
			this.orderView = true;
			this.binaryTree = alg.getBinaryTreeArray(this.R) as Node;
			this.createTreeHTML();
		}
	}
}
