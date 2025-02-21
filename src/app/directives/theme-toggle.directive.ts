import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appThemeToggle]'
})
export class ThemeToggleDirective implements OnInit{

  private isDarkTheme: boolean = false;



  constructor(private elf: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {

    const storedTheme = localStorage.getItem('isDarkTheme');
    this.isDarkTheme = storedTheme === 'true';

    if(this.isDarkTheme){
      this.enableDarkTheme();
    } else{
      this.disableDarkTheme();
    }
  }

  @HostListener('click') toggleTheme(){
    this.isDarkTheme =!this.isDarkTheme;

    if(this.isDarkTheme){
      this.enableDarkTheme();
    } else{
      this.disableDarkTheme();
    }

    localStorage.setItem('isDarkTheme', this.isDarkTheme.toString());
  }

  private enableDarkTheme(): void{
    this.renderer.addClass(document.body, 'dark-theme');
  }

  private disableDarkTheme(): void{
    this.renderer.removeClass(document.body, 'dark-theme');
  }



}
