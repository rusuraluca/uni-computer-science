import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private httpClient: HttpClient) { }

  check(): Observable<string> {
    return this.httpClient.get(environment.BACKEND_MAIN_URL, {responseType: 'text'});
  }
}
