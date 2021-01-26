import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostsService} from '../../shared/posts.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  post!: Post;
  submitted = false;
  updateSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private postService: PostsService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(switchMap((params: Params) => {
      return this.postService.getById(params.id);
    })).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    this. updateSubscription = this.postService.update({
      // id: this.post.id,
      // author: this.post.author,
      // date: this.post.date,
      //
      // This is equal to ...this.post,
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text
    }).subscribe(() => {
      this.submitted = false;
      this.router.navigate(['admin', 'dashboard']).then();
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      console.log('Unsubscribe update post');
      this.updateSubscription.unsubscribe();
    }
  }
}
