import { Component, OnInit } from '@angular/core';

export type Game = {
  home: boolean;
}

@Component({
  selector: 'app-seriesdeportivas',
  templateUrl: './seriesdeportivas.component.html',
  styleUrls: ['./seriesdeportivas.component.css']
})

export class SeriesdeportivasComponent implements OnInit {
  HOME: boolean = true;
  VISIT: boolean = false;

  maxNGames: number = 11;
  maxNumberOfGames: number = 1;
  ph: number = 0;
  pr: number = 0;
  qh: number = 100;
  qr: number = 100;
  games: Game[] = [{home: true} as Game];
  selectedFile: any;

  solutionMatrix: any[][] = [["", ""], ["", ""]];

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
		
	}

	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				// 
			})
		));
		element.setAttribute('download', "reemplazodata.json");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
  }
  
  removeMaxGames() {
    this.maxNumberOfGames -= 2;
    this.games.pop();
    this.games.pop();
    
    this.solutionMatrix.pop();
    this.solutionMatrix.forEach(row => {
      row.pop();
    });
  }

  addMaxGames() {
    this.maxNumberOfGames += 2;
    this.games.push({home: true} as Game);
    this.games.push({home: true} as Game);
    this.solutionMatrix.forEach(row => {
      row.push("");
    });
    this.solutionMatrix.push(new Array(((this.maxNumberOfGames + 1) / 2) + 1).fill(""));
  }

  validatePh(ph) {
    if (ph > 100) {
      this.ph = 100;
    } else if (ph < 0 || ph == "") {
      this.ph = 0;
    }
    this.qr = this.getQ(this.ph);
  }

  validatePr(pr) {
    if (pr > 100) {
      this.pr = 100;
    } else if (pr < 0 || pr == "") {
      this.pr = 0;
    }
    this.qh = this.getQ(this.pr);
  }

  getQ(prob) {
    return 100 - prob;
  }

  executeAlgorithm() {

  }
}
