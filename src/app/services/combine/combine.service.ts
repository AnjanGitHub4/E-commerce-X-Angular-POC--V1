import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombineService {
  private _apiUrl_1: string = "https://freetestapi.com/api/v1";
  private _apiUrl_2: string = "https://jsonplaceholder.typicode.com";

  private headers = new HttpHeaders({ 
    "Content-Type": "application/json"    
  });

  constructor(private http: HttpClient) { }

  getStudCust(): Observable<any> {

    let defaultStdUrl = `${this._apiUrl_2}/student`;
    let defaultUsrUrl = `${this._apiUrl_2}/users`;

    //const students = this.http.get(`https://cors-anywhere.herokuapp.com/${defaultStdUrl}`, { headers: this.headers })

    const users = this.http.get(defaultUsrUrl,  {headers: this.headers}).pipe(
      retry(1),
      catchError(error => {
        console.error("fetch to users error: ", error);
        return throwError(() => new Error(error.error?.message || 'fetch to users error.'));
      })
    );
    // Calling both APIs simultaneously
    // return forkJoin([students, users]);
    
    return users;
  }

}
