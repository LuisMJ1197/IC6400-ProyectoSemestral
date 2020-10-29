import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notimplemented',
  templateUrl: './notimplemented.component.html',
  styleUrls: ['./notimplemented.component.css']
})
export class NotimplementedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goHome() {
    this.router.navigate([""]);
  }

}
