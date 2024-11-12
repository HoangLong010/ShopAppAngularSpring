import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { enviroment } from '../environments/environment';
import { UserResponse } from '../responses/user/user.response';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${enviroment.apiBaseUrl}/users/register`;
  private apiLogin = `${enviroment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${enviroment.apiBaseUrl}/users/details`;
  private apiConfig = {
    headers: this.createHeaders()
  }

  constructor(private http: HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi'
    })
  }

  register(registerDTO: RegisterDTO): Observable<any> {
    debugger
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig)
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig)
  }

  getUserDetail(token: string) {
    return this.http.get(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {

      if(userResponse == null || !userResponse){
        return
      }
      const userResponseJSON = JSON.stringify(userResponse)

      localStorage.setItem('user', userResponseJSON)
      console.log('User response saved to local storage');

    }
    catch (error) {
      console.error('Error saving user response to local storage', error)
    }
  }

  removeUserDataFromLocalStorage() {
    try {
      localStorage.removeItem('user');
      console.log('User data cleared from local storage');
    } catch (error) {
      console.error('Error clearing user data from local storage', error);
    }
  }

  getUserResponseFromLocalStorage(): UserResponse | null{
    try {
      const userReponseJSON = localStorage.getItem('user')
      if(userReponseJSON == null || userReponseJSON == undefined){
        return null;
      }
      const userRespone = JSON.parse(userReponseJSON!)
      console.log('User response retrieved from local storage');

      return userRespone

      
    } catch(error){
      console.error('Error retrieving user response from local storage: ', error);

      return null
      
    }
  }
}
