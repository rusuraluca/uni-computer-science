import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, Observable, pipe, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit{

  private userSub = new BehaviorSubject<string | null>(null);
  public user = this.userSub.asObservable();

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
    if(this.cookieService.check("user")) {
      this.userSub.next(this.cookieService.get("user"));
    }
  }

  login(username: string, password: string): Observable<void> {
    return this.httpClient.post<{token: string}>(environment.BACKEND_LOGIN_URL, {username: username, password: password}).pipe(
      map(
        (response: {token: string}): void => {
          this.userSub.next(response.token);
          this.cookieService.set("user", response.token, 0, "/");
          return ;
        }
      )
    );
  }

  logout(): void {
    this.cookieService.delete("user");
    this.userSub.next(null);
  }

  latest_user(): string | null {
    return this.userSub.value;
  }
}
