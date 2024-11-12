import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { TokenService } from "../../services/token.service";
import { UserResponse } from "../../responses/user/user.response";


@Component({
    selector: 'user-profile',
    templateUrl: './user.profile.component.html',
    styleUrls: ['./user.profile.component.scss']
})

export class UserProfileComponent implements OnInit {
    userResponse?: UserResponse
    userProfileForm: FormGroup
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router

    ) {
        this.userProfileForm = this.formBuilder.group({
            fullname: [''],
            email: ['', [Validators.email]],
            phone_number: ['', [Validators.minLength(6)]],
            password: ['', [Validators.minLength(3)]],
            retypePassword: ['', [Validators.minLength(3)]],
            date_of_birth: [Date.now()]

        }, {
            validators: this.passwordMatchValidator()
        })
    }

    ngOnInit(): void {
        debugger
        let token:string = this.tokenService.getToken() ?? ''
        this.userService.getUserDetail(token).subscribe({
            next:(response :any) => {
                debugger
                this.userResponse = {
                    ...response,
                    date_of_birth: new Date(response.date_of_birth)
                }
                this.userProfileForm.patchValue({
                    fullname: this.userResponse?.fullname ?? '',
                    address: this.userResponse?.address ?? '',
                    date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0,10),
                })
                this.userService.saveUserResponseToLocalStorage(this.userResponse)
            },
            complete: () => {
                debugger
            },
            error: (error: any) => {
                debugger
                alert(error.error.message)
            }
        })
    }

    passwordMatchValidator(): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const password = formGroup.get('password')?.value
            const retypePassword = formGroup.get('retype_password')?.value

            if(password != retypePassword){
                return {passwordMismatch: true}
            }

            return null
        }
    }
}