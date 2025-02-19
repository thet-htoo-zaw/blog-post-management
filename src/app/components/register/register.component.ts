import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm !: FormGroup;
  registerError : string = "";
  computedAge : number | null = null;
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        dob: ['', [Validators.required, ageValidator(18)]],
        password: ['', [Validators.required, passwordStrengthValidator]],
        confirmPassword: ['', Validators.required]
      },
      { 
        validator: this.passwordMathValidator
      }
    );
    this.registerForm.get('dob')?.valueChanges.subscribe(value =>{
      if(value){
        const today = new Date();
        const dob = new Date(value);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        this.computedAge = age;
      }else{
        this.computedAge = null;
      }
    });
  }



  passwordMathValidator(formGroup: AbstractControl){

    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  onRegister(): void{
    
    if(this.registerForm.valid){

      const { name, email,dob, password } = this.registerForm.value;

      this.authService.register({name, email,dob, password}).subscribe({
        
        next: () => {
          this.registerError = '';
          this.router.navigate(['/'])
        },
        error: (err) => {
          if (err.error && err.error === 'Email already exists') {
            this.registerError = 'This email is already in use. Please use a different email.';
          } else {
            this.registerError = 'Registration failed. Please try again.';
          }
        }  
      })
    } else{
      this.registerForm.markAllAsTouched();
    }
  }
}

function passwordStrengthValidator(control: AbstractControl) : ValidationErrors | null{
  const value: string = control.value;

  if(!value){
    return null;
  }
  const hasUppercase = /[A-Z]/.test(value);
  // const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const hasMinLength = value.length >= 8;

  const passwordValid = hasUppercase && hasNumber && hasSpecialChar && hasMinLength;

  return !passwordValid ? {invalidPassword: true} : null;
}

function ageValidator(minAge : number){
  return (control: AbstractControl) : ValidationErrors | null => {
    if(!control.value) return null;

    const today = new Date();
    const dob = new Date(control.value);

    let age = today.getFullYear() - dob.getFullYear();

    const monthDiff = today.getMonth() - dob.getMonth();

    if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())){
      age--;
    }
    return age > minAge?null : {underAge: {requiredAge: minAge, actualAge: age}}
  };
}

