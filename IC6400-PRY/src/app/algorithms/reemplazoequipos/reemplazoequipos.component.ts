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
export class ReemplazoequiposComponent implements OnInit {
	initialCost: number = 0;
	maxTerm: number = 30;
	term: number = 1;
	maxLifeSpan: number = 10;
	lifeSpan: number = 1;
	lifeSpans: LifeSpan[] = [
		{
			year: 1,
			resale: 0,
			maintenance: 0,
			gain: 0
		}
	];
	isGainActivated: boolean = false;
	selectedFile: any;
	solutionMatrix: number[][] = [
		[0, 0, 0]
	];
	plans: number[][] = [
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0]

	];

	constructor() {}

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

	addTerm() {
		this.term += 1;
		this.solutionMatrix.push([this.term, 0, 0]);
	}

	removeTerm() {
		this.term -= 1;
		this.solutionMatrix.pop();
	}

	validateCost(cost) {
		if (cost == "") {
			this.initialCost = 0;
		}
	}

	validateTerm(term) {
		if (!(Number(term) <= this.maxTerm)) {
			this.term = 30;
		} else if (term == "") {
			this.term = 1;
		}
	}

	validateLifeSpan(lifeSpan) {
		if (!(Number(lifeSpan) <= this.maxLifeSpan)) {
			this.lifeSpan = 30;
		} else if (lifeSpan == "") {
			this.lifeSpan = 1;
		}
	}

	addLifeSpan() {
		this.lifeSpan += 1;
		this.lifeSpans.push({
			year: this.lifeSpan,
			resale: 0,
			maintenance: 0,
			gain: 0
		} as LifeSpan);
	}

	removeLifeSpan() {
		this.lifeSpan -= 1;
		this.lifeSpans.pop();
	}

	executeAlgorithm() {
		let alg = new ReemplazoEquipos(this.lifeSpans, this.term, this.lifeSpan, this.initialCost, this.isGainActivated);
		this.solutionMatrix = alg.execute();
		this.plans = alg.getPlans(this.solutionMatrix);
		console.log(this.plans);
	}

}
