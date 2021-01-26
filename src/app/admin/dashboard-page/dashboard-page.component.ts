import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postSubscription!: Subscription;
  deletePostSubscription!: Subscription;
  searchString = '';

  constructor(private postsService: PostsService) {
  }

  ngOnInit(): void {
    this.postSubscription = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    if (this.deletePostSubscription) {
      this.deletePostSubscription.unsubscribe();
    }
  }

  remove(id: string | undefined): void {
    this.deletePostSubscription = this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }
}
