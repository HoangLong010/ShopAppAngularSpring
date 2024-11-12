import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { UserResponse } from '../../responses/user/user.response';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '';
  password: string = '';
  roles: Role[] = []
  rememberMe: boolean = true
  selectedRole: Role | undefined
  userResponse?: UserResponse


  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {

  }

  ngOnInit() {
    debugger
    // Gọi api lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
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
      role_id: this.selectedRole?.id ?? 1

    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const { token } = response
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                id: response.id,
                fullname: response.fullname,
                address: response.address,
                is_active: response.is_active,
                date_of_birth: new Date(response.date_of_birth),
                facebook_account_id: response.facebook_account_id,
                google_account_id: response.google_account_id,
                role: response.role
              }
              this.userService.saveUserResponseToLocalStorage(this.userResponse)
              this.router.navigate(['/']);
            },
            complete: () => {
              debugger
            }
          })
        }

        
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert(error?.error?.message)
      }
    })

  }
}

