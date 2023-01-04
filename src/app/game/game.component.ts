import { Component, OnInit } from '@angular/core';
import { Game } from 'src/modules/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game!: Game;
  gameId: any;
  gameOver = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          this.setJsonElements(game);
        });
    });
  }

  setJsonElements(game: any) {
    this.game.players = game.players;
    this.game.playerImages = game.playerImages;
    this.game.stack = game.stack;
    this.game.playedCards = game.playedCards;
    this.game.currentPlayer = game.currentPlayer;
    this.game.currentCard = game.currentCard;
    this.game.pickCardAnimation = game.pickCardAnimation;
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    }else if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!;
      this.game.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1500);
    }
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1)
          this.game.playerImages.splice(playerId, 1)
        } else{
          this.game.playerImages[playerId] = change;
        }
        
        this.saveGame();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('user.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());
  }
}
