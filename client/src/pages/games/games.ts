import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URL } from '../url';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-games',
  templateUrl: 'games.html',
})
export class GamesPage {
  games: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    if (typeof navParams.data.showResults === 'undefined') {
      this.http.get(API_URL + '/games').map(res => res.json()).subscribe(
        data => {
          this.games = data.data;
          console.log("now logging");
          console.log(data.data);
        },
        err => {
          console.log("Oops!");
          console.log(err);
        }
      );
    } else if (navParams.data.showResults === true) {
      this.games = navParams.data.data;
    }
  }

  gameInfo(gameTitle) {
    console.log("In games.ts the title is " + gameTitle);
    this.navCtrl.push('GameInfoPage', {
      gameTitle: gameTitle
    });
  }

  addGame() {
    this.navCtrl.push('GameCreatePage');
  }

  searchGame() {
    this.navCtrl.push('SearchPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamesPage');
  }

}
