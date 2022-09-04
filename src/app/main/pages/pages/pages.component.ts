import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CognitoAuthService } from '@services/cognito-auth/cognito-auth.service';
import jwt_decode from "jwt-decode";

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
	Token:any;
	decoded:any;
	username:any;
	constructor(private cas:CognitoAuthService) {
		this.Token=sessionStorage.getItem("token");
		this.decoded = jwt_decode(this.Token);
		this.username=this.decoded.email;
		sessionStorage.setItem("userTokenDetail",this.username);
	}
	
	items: any;
	addItem(newItem: string) {
		this.items = newItem;
	}

	opensidebar: boolean = false;

	open() {
		let x = window.matchMedia('(max-width: 600px)');
		let side: any = <HTMLInputElement>document.getElementById('sidebar');
		let header: any = <HTMLInputElement>(
			document.getElementById('sidebarheader')
		);
		if (x.matches && this.opensidebar) {
			header.style.backgroundColor = 'white';
			header.style.color = 'black';
			side.style.display = 'block';
			this.opensidebar = false;
		} else if (x.matches && !this.opensidebar) {
			header.style.backgroundColor = '#0081BC';
			header.style.color = 'white';
			side.style.display = 'none';
			this.opensidebar = true;
		}
	}
	logout(){
		this.cas.logout();
	}
	close() {
		let rr: any = <HTMLInputElement>document.getElementById('sidebar');
		let header: any = <HTMLInputElement>(
			document.getElementById('sidebarheader')
		);
		this.opensidebar = true;
		rr.style.display = 'none';
		header.style.backgroundColor = '#0081BC';
		header.style.color = 'white';
	}
	scroll: boolean = false;
	scrolling = (s: any) => {
		try {
			let sc = s.target.scrollingElement.scrollTop;
			if (sc >= 100) {
				this.scroll = true;
			} else {
				this.scroll = false;
			}
			this.opensidebar = false;
			this.open();
		} catch (error) {}
	};
	ngOnInit(): void {

		let side: any = <HTMLInputElement>document.getElementById('sidebar');
		side.style.display = 'none';
		this.opensidebar = true;
		window.addEventListener('scroll', this.scrolling, true);
	}
}
