import { Pipe, PipeTransform } from '@angular/core';
import { ChatHepler } from 'src/moduls/chatHelper.class';

@Pipe({
  name: 'transformDate'
})
export class TransformDatePipe implements PipeTransform {

  private chatHelper: ChatHepler = new ChatHepler();

  transform(value: string, ...args: unknown[]): unknown {
    let date= this.chatHelper.parseDate(new Date(Date.now()));
    if(date == value)    
    return "Heute";
    else return value;   
  }

}
