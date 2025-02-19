import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService} from 'src/app/services/blog.service';
import { Post } from'src/app/models/post.model';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts : Post[] = [];
  paginatedPosts: Post[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalPosts = 0;
  currentUser :User | null = null;

  @ViewChild(MatPaginator) paginator!:  MatPaginator;

  constructor(
    private blogService:BlogService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    this.blogService.getAllPosts().subscribe(posts => {
      this.posts = posts.map( post =>({
        ...post,
        likes: post.likes ?? 0,
        comments: post.comments?? [],
        authorName: post.authorName || 'Unknown author'
      }));

      this.totalPosts = this.posts.length;
      this.updatePaginatedPosts();
    });
  }

  updatePaginatedPosts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedPosts();
  }

  openPost(id?:number) {
    if(id){
      this.router.navigate(['/post', id]);
    }
  }

  onLike(post:Post):void{
    if(!this.currentUser){
      alert('You must be logged in to like a post');
      return;
    }

    this.blogService.likePost(post, this.currentUser.id).subscribe({
      next: (updatedPost) => {
        post.likes = updatedPost.likes;
        post.likedBy = updatedPost.likedBy;
        console.log('Post updated successfully', updatedPost);
      },
      error: (error) => {
        console.error('Error liking post', error);
        alert('Failed to like post');
      }
    });

    // if(!post.likedBy){
    //   post.likedBy = [];
    // }
    // const userId = this.currentUser.id;

    // if(post.likedBy.includes(userId)){
    //   post.likedBy = post.likedBy.filter(id => id!== userId);
    // } else{
    //   post.likedBy.push(userId);
    // }
    
    // post.likes = post.likedBy.length;
    
    // this.blogService.updatePost(post).subscribe(
    //   updated => {
      
    //   }
    // );

    // updatedPost => {
    //   post.likes = updatedPost.likes;
    //   post.likedBy = updatedPost.likedBy;
    //   console.log('Post updated with new like count :', post.likes);
    // }
  }
  goBack(): void {
    this.router.navigate(['/']);
  }


}
