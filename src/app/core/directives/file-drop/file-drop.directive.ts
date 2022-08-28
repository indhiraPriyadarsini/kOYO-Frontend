import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from '@angular/core';

@Directive({
	selector: '[fileDrop]',
})
export class FileDropDirective {
	constructor() {}

	@Input() fileType: string | string[];
	@Input() size: number;

	@Output() fileDropped = new EventEmitter<File>();
	@Output() fileHovered = new EventEmitter<boolean>();
	@Output() errorMsg = new EventEmitter<string>();

	checkType(type: string) {
		if (this.fileType)
			if (typeof this.fileType === 'object')
				return this.fileType.includes(type);
			else return this.fileType === type;
		else return type === 'application/pdf';
	}

	@HostListener('drop', ['$event']) onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		const file = event.dataTransfer.files[0];
		if (!this.checkType(file.type)) {
			const fileTypeEmit = this.fileType ? this.fileType.toString() : '.pdf';
			this.errorMsg.emit(`file type must be ${fileTypeEmit}`);
		} else if (file.size > (this.size || 3000000))
			this.errorMsg.emit('file size must be less than 3MB');
		else {
			this.fileDropped.emit(file);
			this.errorMsg.emit('');
		}
		this.fileHovered.emit(false);
	}

	@HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		const item = event.dataTransfer.items[0];
		if (this.checkType(item.type)) this.fileHovered.emit(true);
		else this.fileHovered.emit(false);
	}

	@HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.fileHovered.emit(false);
	}
}
