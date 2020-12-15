import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AttachSession } from 'protractor/built/driverProviders';
import { ArbolesBinarios } from './logic/arboles-binarios';

export type Key = {
	code: string,
	height: number,
	prob: number
};

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

export class ArbolesbinariosComponent implements OnInit {
	//@ViewChild('binarytreet', { static: true }) binaryTreet: ElementRef<HTMLElement>;

	selectedFile: any;
	keyQ: number = 1;
	maxKeyQ: number = 15;
	keys: Key[] = [{code: "Key1", height: 0, prob: 0}];
	orderedKeys: Key[] = [];
	A: number[][] = [];
	R: number[][] = [];
	orderView: boolean = false;
	tableAView: boolean = true;
	treeView: boolean = false;
	binaryTree: Node = {value: 0, left: null, right: null};
	document: any;

	constructor(@Inject(DOCUMENT) document) { 
		this.document = document;
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
		this.keys = file.keys;
		this.keyQ = this.keys.length;
	}

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

	addKey() {
		this.keyQ += 1;
		this.keys.push({code: "Key".concat(this.keyQ.toString()), height: 0, prob: 0} as Key);
	}

	removeKey() {
		this.keyQ -= 1;
		this.keys.pop();
	}

	getChilds(node: Node) {
		if (node != null) {
			return `
				<a href="#">${this.keys[node.value - 1].code}</a>
				${node.left == null && node.right == null ? `` : 
					`
						<ul>
							${node.left == null ? `` :
								`
									<li>
									${this.getChilds(node.left)}
									</li>	
								`
							}
							${node.right == null ? `` :
								`
									<li>
									${this.getChilds(node.right)}
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

	createTree() {
		let html = `
			<ul>
				<li>
					${this.getChilds(this.binaryTree)}
				</li>
			</ul>
		`;
		document.getElementById("binarytree").innerHTML = html;
	}

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
			this.createTree();
		}
	}
}
