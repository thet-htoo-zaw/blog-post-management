import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser: User | null = null;

  isDarkTheme: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user) =>{
      this.currentUser = user;
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleTheme():void{
    this.isDarkTheme =!this.isDarkTheme;
    const body = document.body;

    if(this.isDarkTheme){
      body.classList.add('dark-theme');
    } else{
      body.classList.remove('dark-theme');
    }
  }

}
