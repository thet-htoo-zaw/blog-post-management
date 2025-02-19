import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { Post,Comment } from'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  post !: Post;
  currentUser: User | null = null;;
  newCommentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const resolvedPost = data['post'];
      if(resolvedPost){
        this.post = {
          ...resolvedPost,
          likes: resolvedPost.likes?? 0,
          comments: resolvedPost.comments?? []
        }
      } else{
        this.router.navigate(['/']);
      }
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      });
    });
    // const idParam = Number(this.route.snapshot.paramMap.get('id'));
    // if(idParam){
    //   const postId = +idParam;
    //   this.blogService.getPostById(postId).subscribe(post => {
    //     this.post = {
    //       ...post,
    //       likes: post.likes?? 0,
    //       comments: post.comments?? []
    //     };
    //   });
    // } else{
    //   this.router.navigate(['/']);
    // }
    // this.authService.user$.subscribe(user => {
    //   this.currentUser = user;
    // });
  }
  onLike(post: Post): void {
    if (!this.currentUser) {
      alert('You must be logged in to like a post');
      return;
    }
    this.blogService.likePost(post, this.currentUser.id).subscribe({
      next: (updatedPost) => {
        this.post.likes = updatedPost.likes;
        this.post.likedBy = updatedPost.likedBy;
        console.log('Post updated successfully:', updatedPost);
      },
      error: (error) => {
        console.error('Error updating post:', error);
        alert('There was an error updating your like. Please try again.');
      }
    });
  }
  

  // onLike(): void{

  //   if(!this.currentUser){
  //     alert('You must be logged in to like a post');
  //     return;
  //   }
  //   this.blogService.likePost(this.post, this.currentUser.id).subscribe(updatedPost => {
  //     this.post.likes = updatedPost.likes;
  //     this.post.likedBy = updatedPost.likedBy;
  //     console.log('Post updated with new like count :', this.post.likes);
  //   })
  // }

  onAddComment():void{
      const commentText = this.newCommentText.trim();
      if(!commentText) return;
  
      if(!this.currentUser){
        alert('You must be logged in to comment');
        return;
      }
  
      const newComment:Comment = {
        content : commentText,
        authorId : this.currentUser.id,
        createdAt : new Date().toISOString()
      };
  
      this.post.comments?.push(newComment);
      this.newCommentText = '';
      this.blogService.updatePost(this.post).subscribe(
        updated => {
        }
      );
    }

    onEditPost():void{
      this.router.navigate(['/edit', this.post.id]);
    }

    onDeletePost():void{
      if(confirm('Are you sure you want to delete this post?')){
        this.blogService.deletePost(this.post.id!).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
    goBack(): void {
      this.router.navigate(['/']);
    }


}
