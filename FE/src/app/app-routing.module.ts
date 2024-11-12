import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AuthGuard } from './services/auth.guard';
import { UserProfileComponent } from './components/user-profile/user.profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'product/:id', component: DetailProductComponent },
  { path: 'orders', component: OrderComponent, canActivate:[AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuard] },
  { path: 'orders/:id', component: OrderDetailComponent}

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
