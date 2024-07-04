import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  serverError: string | null = null;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    ;
  }

  login() {
    if(this.loginForm.valid) {
      let value = this.loginForm.value;
      this.loginService.login(value.username!, value.password!).subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: () => {
          this.serverError = "error";
        }
      })
    }
  }
}
