import { Time } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import moment from 'moment';
export function timeValidator(control: AbstractControl): any {
	if (control.value.startTime === '' || control.value.endTime === '') {
		return true;
	}
	if (control.value.startTime !== '' && control.value.endTime !== '') {
		if (control.value.startTime < control.value.endTime) {
			return true;
		} else {
			return { value: true };
		}
	}
}

export function convertToAMPM(time: any): string {
	let timeString = time;
	let H: any = timeString.substr(0, 2);
	let h = H % 12 || 12;
	let ampm = H < 12 ? ' AM' : ' PM';
	timeString = h + timeString.substr(2, 3) + ampm;
	if (h < 10) {
		timeString = '0' + timeString;
	}
	return timeString;
}

export function convertToIST(time: any): string {
	let hours = parseInt(time.substr(0, 2));
	if (time.indexOf('AM') != -1 && hours == 12) {
		time = time.replace('12', '0');
	}
	if (time.indexOf('PM') != -1 && hours < 12) {
		time = time.replace(hours + '', '' + (hours + 12));
		if (time.substr(0, 1) === '0') time = time.replace('0', '');
	}
	return time.replace(/(AM|PM)/, '').trim();
}

export function convertToTime(timeStr: string): Time {
	const [time, modifier] = timeStr.trim().split(' ');
	let [hours, minutes] = time.split(':').map((v) => Number(v));
	if (hours === 12) {
		hours = 0;
	}
	if (modifier === 'PM') {
		hours += 12;
	}
	return { hours, minutes };
}

export function convertToTimeStamp(date: any) {
	return moment(date).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss' + '.000') + 'Z';
}

export function convert24ToTime(timeStr: string): Time {
	const [hours, minutes] = timeStr.trim().split(':').map(Number);
	return { hours, minutes };
}

export function convertToDateTime(timeString: string): Date {
	const time =
		timeString.trim().indexOf('M') === -1
			? convert24ToTime(
					timeString.length > 5
						? timeString.split('T')[1].slice(0, 5)
						: timeString
			  )
			: convertToTime(timeString);
	const date = new Date();
	date.setHours(time.hours);
	date.setMinutes(time.minutes);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
}

export function checkStartTime(
	startingTime: any,
	BreakStartTime: any,
	interviewDuration: number
): boolean {
	let startTime = convertToDateTime(startingTime);
	let breakStartTime = convertToDateTime(BreakStartTime);
	let date1 = new Date(startTime);
	let date2 = new Date(breakStartTime);
	let duration = +interviewDuration;
	let time = (60 / duration) * 24;
	let currentDate = date1.getDate();
	for (let i = 0; i < time; i++) {
		if (date1.getDate() > currentDate) {
			return false;
		}
		if (
			date1.getHours() + ':' + date1.getMinutes() ===
			date2.getHours() + ':' + date2.getMinutes()
		) {
			return true;
		} else {
			date1.setMinutes(date1.getMinutes() + duration);
		}
	}
	return false;
}

export function getTimeFromDate(dateString: string): string {
	try {
		const date = new Date(dateString);
		return date.getHours() + ':' + date.getMinutes();
	} catch (err) {
		return JSON.stringify(err);
	}	
}

export function convertDateToTimeString(
	date: Date,
	format: string = 'timeStamp'
): string {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return format === 'ampm'
		? convertToAMPM(
				(hours < 10 ? '0' + hours : hours) +
					':' +
					(minutes < 10 ? '0' + minutes : minutes)
		  )
		: convertToTimeStamp(date);
}
