import { Component, OnInit } from '@angular/core';

type Node = {
  name: string
}

@Component({
  selector: 'app-floyd',
  templateUrl: './floyd.component.html',
  styleUrls: ['./floyd.component.css']
})

export class FloydComponent implements OnInit {
  nodeCount: number = 0;
  maxNodeCount: number = 10;
  nodes: Node[] = [];
  selectedFile: any;

  constructor() { }

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
		this.nodeCount = file.nodeCount;
		this.nodes = file.nodes;
		// Updating items to not-selected
	}

	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				"nodeCount": this.nodeCount,
				"nodes": this.nodes
			})
		));
		element.setAttribute('download', "knapsackdata.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

  addNode() {
    this.nodes.push({name: String.fromCharCode(this.nodes.length + 65)} as Node);
  }

  removeNode() {
    this.nodes.pop();
  }

  executeAlgorithm() {

  }
}
