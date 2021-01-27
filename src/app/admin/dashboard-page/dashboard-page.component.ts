import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

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

  constructor(private postsService: PostsService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.postSubscription = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {

    if (this.postSubscription) {
      console.log('Unsubscribe post');
      this.postSubscription.unsubscribe();
    }

    if (this.deletePostSubscription) {
      console.log('Unsubscribe delete post');
      this.deletePostSubscription.unsubscribe();
    }
  }

  remove(id: string | undefined): void {
    this.deletePostSubscription = this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alertService.warning('The post has been removed');
    });
  }
}
