import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elementAt, Observable } from 'rxjs';
import { Post } from '../models/post.model';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private API_URL = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  getAllPosts(): Observable<any[]>{
    return this.http.get<Post[]>(`${this.API_URL}/posts`);
  }

  getPostById(id: number): Observable<Post>{
    return this.http.get<Post>(`${this.API_URL}/posts/${id}`);
  }

  createPost(post: Post): Observable<Post>{
    return this.http.post<Post>(`${this.API_URL}/posts`, post);
  }

  updatePost(post: Post): Observable<Post>{
    return this.http.put<Post>(`${this.API_URL}/posts/${post.id}`, post);
  }

  deletePost(id: number): Observable<any>{
    return this.http.delete(`${this.API_URL}/posts/${id}`);
  }

  /**
   * 
   * onLike(post:Post):void{
    if(!this.currentUser){
      alert('You must be logged in to like a post');
      return;
    }

    if(!post.likedBy){
      post.likedBy = [];
    }
    const userId = this.currentUser.id;

    if(post.likedBy.includes(userId)){
      post.likedBy = post.likedBy.filter(id => id!== userId);
    } else{
      post.likedBy.push(userId);
    }
    
    post.likes = post.likedBy.length;
    
    this.blogService.updatePost(post).subscribe(
      updated => {
      
      }
    );
  }
   */
  likePost(post:Post, userId: number):Observable<Post>{

    if(!post.likedBy){
      post.likedBy = [];
    }

    if(post.likedBy.includes(userId)){
      post.likedBy = post.likedBy.filter(id => id!== userId);
    }else{
      post.likedBy.push(userId);
    }
    post.likes = post.likedBy.length;

    return this.updatePost(post);
  }
}

