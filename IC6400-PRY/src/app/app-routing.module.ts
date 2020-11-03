import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArbolesbinariosComponent } from './algorithms/arbolesbinarios/arbolesbinarios.component';
import { FloydComponent } from './algorithms/floyd/floyd.component';
import { MatricesComponent } from './algorithms/matrices/matrices.component';
import { MochilaComponent } from './algorithms/mochila/mochila.component';
import { ReemplazoequiposComponent } from './algorithms/reemplazoequipos/reemplazoequipos.component';
import { SeriesdeportivasComponent } from './algorithms/seriesdeportivas/seriesdeportivas.component';
import { LoggedoutComponent } from './loggedout/loggedout.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';

const routes: Routes = [
  {
    path: "",
    component: MainmenuComponent
  },
  {
    path: "floyd",
    component: FloydComponent
  },
  {
    path: "mochila",
    component: MochilaComponent
  },
  {
    path: "reemplazoequipos",
    component: ReemplazoequiposComponent
  },
  {
    path: "arbolesbinarios",
    component: ArbolesbinariosComponent
  },
  {
    path: "seriesdeportivas",
    component: SeriesdeportivasComponent
  },
  {
    path: "multiplicacionmatrices",
    component: MatricesComponent
  },
  {
    path: "loggedout",
    component: LoggedoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
