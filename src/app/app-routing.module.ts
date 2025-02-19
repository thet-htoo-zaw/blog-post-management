import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { AuthGuard } from './guards/auth.guard';
import { PostResolver } from './resolvers/post.resolver';

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'post/:id', component: PostDetailComponent, resolve: {post: PostResolver}},
  {path: 'create', component: PostFormComponent, canActivate: [AuthGuard] },
  {path: 'edit/:id', component: PostFormComponent, canActivate: [AuthGuard], resolve: {post: PostResolver}},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
