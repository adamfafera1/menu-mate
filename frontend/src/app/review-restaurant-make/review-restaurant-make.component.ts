import { Component, EventEmitter, Input, Output, OnInit, OnChanges} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-review-restaurant-make',
  standalone: true,
  imports: [DialogModule, InputTextModule, ButtonModule, FormsModule, DialogModule, RatingModule, FloatLabelModule, TextareaModule],
  templateUrl: './review-restaurant-make.component.html',
  styleUrl: './review-restaurant-make.component.css',
})


export class ReviewRestaurantMakeComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  title: string ='';
  description: string = '';
  rating: number = 0;
  currentUser: any = null;

  constructor(public messageService: MessageService, public http: HttpClient, private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnChanges() {
    if (this.visible && !this.currentUser) {
      this.loadCurrentUser();
    }
  }

  ngOnInit() {
  }

  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({severity:'warn', summary: "Login Required", detail:"Please log in to post a review"});
      localStorage.setItem('reviewLoggedOut', 'true')
      this.closeDialog();
      this.router.navigate(['/login']);
      return;
    }

    const userFromToken = this.authService.getUserFromToken();
    if (userFromToken && userFromToken.id) {
      this.authService.getUserById(userFromToken.id).subscribe(
        (user) => {
          this.currentUser = user;
        },
        (error) => {
          console.error('Failed to fetch user data by ID', error);
          this.messageService.add({severity:'error', summary: "Error", detail:"Failed to load user data"});
        }
      );
    } else {
      console.error('Failed to decode user ID from token');
      this.messageService.add({severity:'warn', summary: "Login Required", detail:"Please log in to post a review"});
      this.closeDialog();
      this.router.navigate(['/login']);
    }
  }
  
  postReview() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({severity:'warn', summary: "Login Required", detail:"Please log in to post a review"});
      this.closeDialog();
      this.router.navigate(['/login']);
      return;
    }

    if (!this.currentUser) {
      this.messageService.add({severity:'error', summary: "Error", detail:"User data not loaded. Please try again."});
      return;
    }

    const restaurantId = this.route.snapshot.paramMap.get('id')

    const review = {
      restaurantId: restaurantId,
      userId: this.currentUser.id,
      userName: this.currentUser.userName,
      userImagePath: this.currentUser.imagePath || "https://innostudio.de/fileuploader/images/default-avatar.png",
      title: this.title,
      description: this.description,
      rating: this.rating 
    }

    this.http.post(`https://localhost:7084/api/Reviews`, review)
      .subscribe({
        next: (response) => {
          console.log('Review posted successfully ', response);
          this.messageService.add({severity:'success', summary: "Success", detail:"Review posted"});
          this.closeDialog();
          this.resetForm();
        },
        error: (error) =>{
          console.error('Error posting review', error);
          this.messageService.add({severity:'error', summary: "Error", detail:"Failed to post review"});
        }
      })

  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.rating = 0;
  }

}
