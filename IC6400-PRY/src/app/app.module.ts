import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { FloydComponent } from './algorithms/floyd/floyd.component';
import { MochilaComponent } from './algorithms/mochila/mochila.component';
import { ReemplazoequiposComponent } from './algorithms/reemplazoequipos/reemplazoequipos.component';
import { ArbolesbinariosComponent } from './algorithms/arbolesbinarios/arbolesbinarios.component';
import { SeriesdeportivasComponent } from './algorithms/seriesdeportivas/seriesdeportivas.component';
import { MatricesComponent } from './algorithms/matrices/matrices.component';
import { NotimplementedComponent } from './notimplemented/notimplemented.component';
import { LoggedoutComponent } from './loggedout/loggedout.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    NotimplementedComponent,
    FloydComponent,
    MochilaComponent,
    ReemplazoequiposComponent,
    ArbolesbinariosComponent,
    SeriesdeportivasComponent,
    MatricesComponent,
    NotimplementedComponent,
    LoggedoutComponent,
    HeaderMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
