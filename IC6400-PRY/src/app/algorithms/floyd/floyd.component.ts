import { Component, OnInit } from '@angular/core';
import {Floyd} from './logic/floyd';

type Node = {
	name: string
}

type Cell = {
	value: string
}

@Component({
	selector: 'app-floyd',
	templateUrl: './floyd.component.html',
	styleUrls: ['./floyd.component.css']
})

export class FloydComponent implements OnInit {
	maxNodeCount: number = 10;
	nodes: Node[] = [{ name: "A" } as Node];
	selectedFile: any;
	adjacencyM: Cell[][] = [];
	listView: boolean = true;
	DArrays: Array<Number[][]> = new Array();
	PArrays: Array<Number[][]> = new Array();
	isExecuting: boolean;
	DView: boolean;
	PView: boolean;
	currentDArray: string[][] = [];
	currentPArray: Number[][] = [];
	currentResultIndex:number;
	selectedFirstNode: number = null;
	selectedSecondNode: number = null;
	floydAlgorithm:Floyd = null;
	path:String = "";

	constructor() { 
		this.adjacencyM.push([{value: "0"}] as Cell[]);
		this.isExecuting = false;
		this.DView = true;
		this.PView = false;
		this.currentResultIndex = 0;
	}

	ngOnInit(): void {
	}

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

	loadFile(file) {
		this.nodes = file.nodes;
		// Updating items to not-selected
		this.isExecuting = false;
		this.nodes = file.nodes;
		this.adjacencyM = file.table;
		this.adjacencyM.forEach((row) => {
			row.forEach((cell) => {
				cell.value = cell.value == null ? "∞" : cell.value;
			});
		});
		this.setDiagonals();
	}

	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				"nodes": this.nodes,
				"table": this.adjacencyM
			})
		));
		element.setAttribute('download', "floyd.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	addNode() {
		this.nodes.push({ name: String.fromCharCode(this.nodes.length + 65) } as Node);
		this.isExecuting = false;
	}

	removeNode() {
		this.nodes.pop();
		this.isExecuting = false;
	}

	executeAlgorithm() {
		this.isExecuting = true;
		this.floydAlgorithm = new Floyd(this.nodes.length, this.createD0MAtrix());
		this.floydAlgorithm.execute();
		this.DArrays = this.floydAlgorithm.DArrays;
		this.PArrays = this.floydAlgorithm.PArrays;
		this.currentDArray = this.setCurrentDArray(this.DArrays[this.currentResultIndex]);
		this.DView = true;
	}

	reExecuteAlgorithm(){
		this.isExecuting = false;
		this.executeAlgorithm();
	}

	setCurrentDArray(DArray:Number[][]){
		let newDArray:string[][] = [];
		for(let i = 0; i < DArray.length; i++){
			let newRow:string[] = [];
			for(let j = 0; j < DArray.length; j++){
				if(DArray[i][j].valueOf() == Infinity) newRow.push("∞");
				else newRow.push(DArray[i][j].valueOf().toString());
			}
			newDArray.push(newRow);

		}
		return newDArray;
	}

	validateName(node: Node) {
		if (node.name == "") {
			node.name = String.fromCharCode(this.nodes.indexOf(node) + 65);
		}
	}

	addRow() {
		this.adjacencyM.forEach((row) => {
			row.push({value: "∞"} as Cell);
		});
		var i: number = 0;
		var newA = new Array(this.nodes.length) as Cell[];
		for (i = 0; i < this.nodes.length; i++) {
			newA[i] = ({value: "∞"} as Cell);
		}
		this.adjacencyM.push(newA);
		this.setDiagonals();
		
	}

	setDiagonals(){
		for(let i = 0; i < this.adjacencyM.length; i++){
			for(let j = 0; j < this.adjacencyM.length; j++){
				if(i == j) this.adjacencyM[i][j].value = "0";
			}
		}
	}

	removeRow() {
		this.adjacencyM.pop();
		this.adjacencyM.forEach((row) => {
			row.pop();
		});
	}

	add(){
		this.addNode();
		this.addRow();
	}

	remove(){
		this.removeNode();
		this.removeRow();
	}

	validateDistance(cell: Cell){
		if(cell.value == ""){
			cell.value = "∞";
		}
	}

	createD0MAtrix(){
		let adjacencyMatrix: Number[][] = [];
		for(let i = 0; i < this.adjacencyM.length; i++){
			let row:Cell[] = this.adjacencyM[i];
			let newRow:Number[] = [];
			for(let j = 0; j < row.length; j++){
				if(row[j].value == "∞") newRow.push(Number.POSITIVE_INFINITY);
				else newRow.push(Number.parseInt(row[j].value));
			}
			adjacencyMatrix.push(newRow);
		}
		return adjacencyMatrix;
	}

	setCellValue(value:Number){
		let newValue:string = "";
		if(value == Infinity){
			newValue = "∞";
		} 
		else newValue = value.toString();
		return value;
	}

	previous(){
		if(this.currentResultIndex > 0){
			this.currentResultIndex -= 1;
			this.currentDArray = this.setCurrentDArray(this.DArrays[this.currentResultIndex]);
			this.currentPArray = this.PArrays[this.currentResultIndex];
		}
	}

	next(){
		if(this.currentResultIndex < this.DArrays.length){
			this.currentResultIndex += 1;
			this.currentDArray = this.setCurrentDArray(this.DArrays[this.currentResultIndex]);
			this.currentPArray = this.PArrays[this.currentResultIndex];
		}
	}

	viewMatrixResult(){
		this.DView = !this.DView;
		this.PView = !this.PView;
	}

	getPath(){
		if(this.floydAlgorithm != null && this.selectedFirstNode != null && this.selectedSecondNode != null){
			this.path = this.floydAlgorithm.constructPath(Number(this.selectedFirstNode), Number(this.selectedSecondNode));
			
		}
	}

}
