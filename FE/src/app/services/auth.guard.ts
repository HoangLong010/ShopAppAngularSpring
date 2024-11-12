import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "./token.service";
import { inject, Inject, Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(
        private tokenService: TokenService,
        private router: Router
    ){

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const isTokenExpired = this.tokenService.isTokenExpired()
        const isUserIdValid = this.tokenService.getUserId() > 0

        debugger
        if(!isTokenExpired && isUserIdValid){
            return true
        } else {
            this.router.navigate(['/login'])
            return false
        }
    
    }
}

export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    debugger;
    return inject(AuthGuard).canActivate(next, state);
};