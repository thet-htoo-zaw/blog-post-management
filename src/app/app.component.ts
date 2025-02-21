import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    // const storedTheme = localStorage.getItem('isDarkTheme');

    // console.log(storedTheme);
    // console.log(typeof(storedTheme));

    // if(storedTheme && storedTheme === 'true'){
    //   document.body.classList.add('dark-theme');
    // } else{
    //   document.body.classList.remove('dark-theme');
    // }
  }
  title = 'Blog Post Management';
}
