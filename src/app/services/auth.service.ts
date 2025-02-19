import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import jwt_decode from 'jwt-decode';

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface JwtPayload{
  sub: number;
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000';
  private tokenKey = 'authToken';

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {

    const token = localStorage.getItem(this.tokenKey);

    if (token) {
      try{
          const decoded = jwt_decode<JwtPayload>(token);
          const storedName = localStorage.getItem('userName');

          const user:User = {
            id: decoded.sub,
            email: decoded.email,
            name: storedName || decoded.name
          };
          this.userSubject.next(user);

        }catch(err){
          console.error('Failed to decode token', err);
          localStorage.removeItem(this.tokenKey);
          this.userSubject.next(null);
        }
      }
    }

    register(userData: any){
      return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap( res => this.setSession(res))
      );
    }
    login(credentials : any) : Observable<AuthResponse>{
      return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
            .pipe(
              tap( res => this.setSession(res))
            );
    }
    logout(){
      localStorage.removeItem(this.tokenKey);
      this.userSubject.next(null);
    }
    private setSession(authResult : AuthResponse){
      localStorage.setItem(this.tokenKey, authResult.accessToken);
      if(authResult.user.name){
        localStorage.setItem('userName', authResult.user.name)
      }
      this.userSubject.next(authResult.user);
    }

    findUserByName(name : string): Observable<User | undefined>{
      return this.http.get<User[]>(`${this.API_URL}/users?name=${encodeURIComponent(name)}`)
      .pipe(map(users => users.length ? users[0] : undefined));
    }
}
