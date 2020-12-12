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

/*
	Esta clase se encargara de la gestión del Componente SeriesdeportivasComponent
	Principalmente la gestión de la interfaz y captura de datos por parte del usuario.
*/
export class SeriesdeportivasComponent implements OnInit {
  maxNumberOfGames: number = 1; // Número máximo de juegos ingresados por el usuario.
  ph: number = 0; // Probabilidad de A de ganar en casa
  pr: number = 0; // Probabilidad de A de ganar de visita
  qh: number = 100; // Probabilidad de B de ganar en casa
  qr: number = 100; // Probabilidad de B de ganar de visita
  games: Game[] = [{home: true} as Game]; // Formato de los juegos (se usa Game para aprovechar valores por referencia)
  selectedFile: any;

  solutionMatrix: any[][] = [["", ""], ["", ""]]; // Matriz de la solución.

  constructor() { }

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
    this.maxNumberOfGames = file.maxNumberOfGames;
    this.ph = file.ph;
    this.pr = file.pr;
    this.qh = this.getQ(this.pr);
    this.qr = this.getQ(this.ph);
    this.games = file.format;
    this.createSolutionMatrix(((this.maxNumberOfGames + 1) / 2) + 1);
	}

  /*
		Para guardar (descargar) un archivo con la información actual configurada.
		Se guardará un archivo con el nombre seriesdeportivasdata.json.
	*/
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
  
  /**
   * Elimina dos juegos de la serie, ya que tiene que ser impar.
   */
  removeMaxGames() {
    this.maxNumberOfGames -= 2;
    this.games.pop();
    this.games.pop();
    
    this.solutionMatrix.pop();
    this.solutionMatrix.forEach(row => {
      row.pop();
    });
  }

  /**
   * Añade dos juegos de la serie, ya que tiene que ser impar.
   */
  addMaxGames() {
    this.maxNumberOfGames += 2;
    this.games.push({home: true} as Game);
    this.games.push({home: true} as Game);
    this.solutionMatrix.forEach(row => {
      row.push("");
    });
    this.solutionMatrix.push(new Array(((this.maxNumberOfGames + 1) / 2) + 1).fill(""));
  }

  /**
   * Valida que la cantidad de juegos ingresados por el usuario sea válido, es decir:
   *  - Impar,
   *  - No vacío
   * @param games Cantidad de juegos 
   */
  validateGames(games) {
    if (games % 2 == 0) {
      this.maxNumberOfGames = games + 1;
      games++;
    }
    if (games == "" || games == 0) {
      this.maxNumberOfGames = 1;
    }
    if (games < this.games.length) {
      let n = this.games.length;
      for (let i = 0; i < n - games; i++) {
        this.games.pop();
      }
    } else {
      let n = this.games.length;
      for (let i = 0; i < games - n; i++) {
        this.games.push({home: true});
      }
    }
    this.createSolutionMatrix(((this.maxNumberOfGames + 1) / 2) + 1);
  }

  /**
   * Crea una matriz de solución fake, solo para mostrar inicialmente el tamaño de la matriz resultado.
   * @param gamesToWin 
   */
  createSolutionMatrix(gamesToWin) {
    this.solutionMatrix = new Array(gamesToWin);
    for (let i = 0; i < gamesToWin; i++) {
      this.solutionMatrix[i] = new Array(gamesToWin).fill("");
    }
  }
  
  /**
   * Valida el ph ingresado por el usuario
   * @param ph 
   */
  validatePh(ph) {
    if (ph > 100) {
      this.ph = 100;
    } else if (ph < 0 || ph == "") {
      this.ph = 0;
    }
    this.qr = this.getQ(this.ph);
  }

  /**
   * Valida el pr ingresado por el usuario
   * @param pr 
   */
  validatePr(pr) {
    if (pr > 100) {
      this.pr = 100;
    } else if (pr < 0 || pr == "") {
      this.pr = 0;
    }
    this.qh = this.getQ(this.pr);
  }

  /**
   * Obtiene la probabilidad de Q dependiendo de una probabilidad p
   * @param prob probabilidad p
   */
  getQ(prob) {
    return 100 - prob;
  }

  /**
   * Ejecuta el algoritmo llamando a la clase correspondiente, en este caso, Series deportivas.
   * Le envía: el número de juegos, ph, pr y el formato.
   */
  executeAlgorithm() {
    this.solutionMatrix = new SeriesDeportivas(this.maxNumberOfGames, Number(this.ph), Number(this.pr), this.games).execute();
  }
}
