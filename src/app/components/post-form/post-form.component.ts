import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService} from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  postForm !: FormGroup;
  isEditMode = false;
  postId ?: number;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {  
      this.currentUser = user;
    });

    this.postForm = this.fb.group(
      {
        title: ['', Validators.required],
        content: ['', Validators.required]
    });

    this.route.data.subscribe(data => {
      const resolvedPost = data['post'];
      if(resolvedPost){
        this.postForm.patchValue(resolvedPost);
        this.isEditMode = true;
        this.postId = resolvedPost.id;
      } else{
        this.isEditMode = false;
      }
    });

    // this.route.paramMap.subscribe(params => {
    //   const idParam = params.get('id');
      
    //   if(idParam){
    //     this.isEditMode = true;
    //     this.postId = +idParam;
    //     this.blogService.getPostById(this.postId).subscribe(post => {
    //       this.postForm.patchValue(post);
    //     });
    //   }
    // });

  }

  onSubmit(){
    if(this.postForm.valid){
      const post: Post = this.postForm.value;

      if(this.currentUser && this.currentUser.id){
        post.authorId = this.currentUser.id;
        post.authorName = this.currentUser.name ? this.currentUser.name : this.currentUser.email;
      }else{
        console.error('No user defined');
        return;
      }

      if(this.isEditMode && this.postId){
        post.id = this.postId;
        this.blogService.updatePost(post).subscribe(() => this.router.navigate(['/']));
      } else{
        this.blogService.createPost(post).subscribe(() => this.router.navigate(['/']));
      }
    }
  }

}
