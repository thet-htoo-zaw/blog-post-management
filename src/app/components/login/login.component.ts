
import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  returnUrl !: string;
  loginError : string = "";

  constructor(
      private fb:FormBuilder, 
      private authService:AuthService, 
      private router:Router,
      private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin(){
    if(this.loginForm.valid){
      const {identifier, password} = this.loginForm.value;
      const isEmail = identifier.includes('@');

      let emailObservable$ = isEmail 
      ? of(identifier)
      : this.authService.findUserByName(identifier).pipe(
        switchMap((user: User | undefined) => {
          if(user && user.email){
            return of(user && user.email ? user.email : '');
          } else{
            return of('');
          }
        })
      );

      emailObservable$.subscribe((email: string) =>{
        if(!email) {
          this.loginError = 'User not found. Pleas Register First';
          this.loginForm.get('password')?.reset();
          return;
        }
        this.authService.login({email, password}).subscribe({
          next: (res) => {
            this.loginError = '';
            this.router.navigateByUrl(this.returnUrl)
          },

          error: (err) => {
            if(err.error && err.error === 'Incorrect password'){
              this.loginError = 'Invalid password. Please Try Again';
            } else if(err.error && err.error === 'User not found'){
              this.loginError = 'User not found. Pleas Register First';
            } else{
              this.loginError = 'An error occurred. Please try again';
            }
            this.loginForm.get('password')?.reset();
          }
          }); 
      });
    }
    else{
      this.loginForm.markAllAsTouched();
    }
  }
}
