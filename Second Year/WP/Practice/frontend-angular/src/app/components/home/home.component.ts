import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  response: string = "";
  
  constructor(private mainService: MainService, private loginService: LoginService, private router: Router) {
    ;
  }

  ngOnInit(): void {
    this.mainService.check().subscribe((value) => {
      this.response = value;
    });
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }
}
