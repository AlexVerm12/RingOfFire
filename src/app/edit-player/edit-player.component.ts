import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
  allProfilePicture= ['user.png','user1.png', 'user2.png', 'user3.png', 'user4.png', 'user5.png', 'user6.png', 'user7.png', ];
  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>,public dialog: MatDialog) {}
onNoClick(){
    this.dialogRef.close();
  }
}
