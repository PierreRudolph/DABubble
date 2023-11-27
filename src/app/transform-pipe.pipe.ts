import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformPipe'
})
export class TransformPipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let s = value;
    console.log("transform",value);
    s = s.replace(/\n/g, '<br/>');
    return s;
  }

}
