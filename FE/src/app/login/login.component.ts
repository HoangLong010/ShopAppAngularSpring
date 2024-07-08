import { Component, ViewChild } from '@angular/core';
import { LoginDTO } from '../dtos/user/login.dto';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '0963540';
  password: string = 'hoanglong';
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  constructor(private router: Router, private userService: UserService){

  }

  login() {
    debugger
    const loginDTO: LoginDTO = {
      "phone_number": this.phoneNumber,
      "password": this.password,
      
    };
    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {
        // this.router.navigate(['/login']);
      },
      complete :() => {
        // alert("Đăng ký thành công")
        debugger
      },
      error: (error: any) => {
        debugger
        alert(error)
      }
    })
  
  }
}
