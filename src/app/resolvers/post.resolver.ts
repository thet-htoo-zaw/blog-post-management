import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { BlogService } from '../services/blog.service';

@Injectable({
  providedIn: 'root'
})
export class PostResolver implements Resolve<Post> {

  constructor(
    private blogService: BlogService,
    private router: Router
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post> {

    const postIdParam = route.paramMap.get('id');
    
    if(!postIdParam){
      this.router.navigate(['/']);
      return EMPTY;
    }

    const postId = Number(postIdParam);
    return this.blogService.getPostById(postId).pipe(
      catchError( err => {
        this.router.navigate(['/']);
        return EMPTY;
      })
    );
      
      
  }
}
