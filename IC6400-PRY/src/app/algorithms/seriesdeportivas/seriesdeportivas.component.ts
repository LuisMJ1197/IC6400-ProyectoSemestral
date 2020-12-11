import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { SeriesDeportivas } from './logic/series-deportivas';

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
    this.maxNumberOfGames = file.maxNumberOfGames;
    this.ph = file.ph;
    this.pr = file.pr;
    this.qh = this.getQ(this.pr);
    this.qr = this.getQ(this.ph);
    this.games = file.format;
	}

	saveFile() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
			JSON.stringify({
				maxNumberOfGames: this.maxNumberOfGames,
        ph: this.ph,
        pr: this.pr,
        format: this.games
			})
		));
		element.setAttribute('download', "seriesdeportivasdata.json");

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
    this.solutionMatrix = new SeriesDeportivas(this.maxNumberOfGames, Number(this.ph), Number(this.pr), this.games).execute();
  }
}
