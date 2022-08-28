import { Pipe, PipeTransform } from '@angular/core';
import { convertToAMPM } from 'src/app/core/helpers/timeValidator';

@Pipe({
	name: 'displayAMPM',
})
export class DisplayAMPMPipe implements PipeTransform {
	transform(value: any): any {
		let time = value.substr(11, 5);
		return convertToAMPM(time);
	}
}
