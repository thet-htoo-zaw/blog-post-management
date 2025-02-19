import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitWords'
})
export class LimitWordsPipe implements PipeTransform {

  transform(value: string, wordLimit:number): string {
    if(!value) return value;
    const words = value.split(/\s+/);
    if(words.length <= wordLimit){
      return value;
    }
    return words.slice(0, wordLimit).join(' ')+ '....';
  }

}
