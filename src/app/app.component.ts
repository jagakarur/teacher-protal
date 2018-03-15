// Angular
import { Component, ViewChild } from '@angular/core';

// RxJS
import { ReplaySubject } from "rxjs/ReplaySubject";
import { ArrayObservable } from "rxjs/observable/ArrayObservable";

// Ionic
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//pages
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/message';

// Side Menu Component
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content.component';
import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { MenuOptionModel } from './../shared/side-menu-content/models/menu-option-model';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	// Get the instance to call the public methods
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

	public rootPage: any = MessagesPage;

	// Options to show in the SideMenuComponent
	public options: Array<MenuOptionModel>;

	// Settings for the SideMenuComponent
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: false,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option',
		subOptionIndentation: {
			md: '56px',
			ios: '64px',
			wp: '56px'
		}
	};

	private unreadCountObservable: any = new ReplaySubject<number>(0);

	constructor(private platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private alertCtrl: AlertController,
		private menuCtrl: MenuController) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleLightContent();
			this.splashScreen.hide();

			// Initialize some options
			this.initializeOptions();
		});

		// Change the value for the batch every 5 seconds
		setInterval(() => {
			this.unreadCountObservable.next(Math.floor(Math.random() * 10));
		}, 5000);

	}

	private initializeOptions(): void {
		this.options = new Array<MenuOptionModel>();

		// Load simple menu options
		// ------------------------------------------
		// this.options.push({
		// 	iconName: 'home',
		// 	displayName: 'Home',
		// 	component: HomePage,

		// 	// This option is already selected
		// 	selected: true
		// });

		// this.options.push({
		// 	iconName: 'analytics',
		// 	displayName: 'Social Development',
		// 	component: MessagesPage
		// });

		// this.options.push({
		// 	iconName: 'apps',
		// 	displayName: 'Math Help',
		// 	component: MessagesPage
		// });

		this.options.push({
			iconName: 'mail',
			displayName: 'Messages',
			badge: ArrayObservable.of('NEW'),
			component: MessagesPage,
			selected: true
		});

		// Load options with nested items (with icons)
		// -----------------------------------------------
		this.options.push({
			displayName: 'Social Development',
			subItems: [
				{
					iconName: 'people',
					displayName: 'Grade One',
					component: MessagesPage
				},
				{
					iconName: 'people',
					displayName: 'Grade Two',
					component: MessagesPage
				},
				{
					iconName: 'people',
					displayName: 'Grade Three',
				//	badge: this.unreadCountObservable,
					component: MessagesPage
				}
			]
		});

		// Load options with nested items (without icons)
		// -----------------------------------------------
		this.options.push({
			displayName: 'Math Help',
			subItems: [
				{
					iconName: 'people',
					displayName: 'Grade Four',
					component: MessagesPage
				},
				{
					iconName: 'people',
					displayName: 'Grade Five',
					component: MessagesPage
				}
			]
		});

		// Load special options
		// -----------------------------------------------
		this.options.push({
			displayName: 'Special options',
			subItems: [
				{
					iconName: 'log-in',
					displayName: 'Login',
					custom: {
						isLogin: true
					}
				},
				{
					iconName: 'log-out',
					displayName: 'Logout',
					custom: {
						isLogout: true
					}
				},
				{
					iconName: 'globe',
					displayName: 'Open Google',
					custom: {
						isExternalLink: true,
						externalUrl: 'http://www.google.com'
					}
				}
			]
		});
	}

	public selectOption(option: MenuOptionModel): void {
		this.menuCtrl.close().then(() => {
			if (option.custom && option.custom.isLogin) {
				this.presentAlert('You\'ve clicked the login option!');
			} else if (option.custom && option.custom.isLogout) {
				this.presentAlert('You\'ve clicked the logout option!');
			} else if (option.custom && option.custom.isExternalLink) {
				let url = option.custom.externalUrl;
				window.open(url, '_blank');
			} else {
				// Redirect to the selected page
				this.nav.setRoot(option.component || MessagesPage, { 'title': option.displayName });
			}
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}
	//https://github.com/jagakarur/teacher-protal.git

	public presentAlert(message: string): void {
		let alert = this.alertCtrl.create({
			title: 'Information',
			message: message,
			buttons: ['Ok']
		});
		alert.present();
	}
}
