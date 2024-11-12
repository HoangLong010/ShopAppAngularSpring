import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user/user.response';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  userResponse?: UserResponse | null
  isPopoverOpen = false
  activeNavItem: number = 0

  togglePopover(event: Event): void{
    event.preventDefault()
    this.isPopoverOpen = !this.isPopoverOpen

  }

  handleItemClick(index: number): void{
    if(index === 0 ){
        this.router.navigate(['/user-profile'])
    } 
    else if(index === 2) { 
      this.userService.removeUserDataFromLocalStorage()
      this.tokenService.removeToken()
      this.userResponse = this.userService.getUserResponseFromLocalStorage()

    }
    this.isPopoverOpen = false

    

  }

  constructor(
    private userService: UserService,
    private popoverConfig: NgbPopoverConfig,
    private tokenService: TokenService,
    private router: Router
  ){

  }
  
  ngOnInit() {
       this.userResponse = this.userService.getUserResponseFromLocalStorage()
  }

  setActiveItem(index: number){
    debugger
    this.activeNavItem = index
    alert(this.activeNavItem)
  }
}
 