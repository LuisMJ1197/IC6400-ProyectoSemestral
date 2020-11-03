import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {
  public message: boolean = false;
  private goto: string = "";

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  go(route) {
    this.message = true;
    this.goto = route;
  }

  goRoute() {
    this.message = false;
    this.router.navigate([this.goto]);
  }
}
