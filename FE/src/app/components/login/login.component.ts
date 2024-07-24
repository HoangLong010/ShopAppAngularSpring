import { Component, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '0963540';
  password: string = 'hoanglong';
  roles: Role[] = []
  rememberMe: boolean = true
  selectedRole: Role | undefined


  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {

  }

  ngOnInit(){
    // Gọi api lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next:(roles: Role[]) => {
        debugger
        this.roles = roles
        this.selectedRole = roles.length > 0 ? roles[0] : undefined
      },
      error: (error: any) => {
        debugger
        console.error('Error getting roles: ', error);
        
      }
    })
  }

  login() {
    debugger
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id??1

    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const { token } = response
        if(this.rememberMe){
          this.tokenService.setToken(token);
        }

        // this.router.navigate(['/login']);
      },
      complete: () => {
        // alert("Đăng ký thành công")
        debugger
      },
      error: (error: any) => {
        debugger
        alert(error?.error?.message)
      }
    })

  }
}

