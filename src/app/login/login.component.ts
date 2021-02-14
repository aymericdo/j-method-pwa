import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  googleLoginUrl: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('home');
    }

    const code: string = this.route.snapshot.queryParamMap.get('code');
    const error: string = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      console.log(`An error occurred: ${error}`);
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    } else {
      if (code) {
        this.loginService.postSignIn(code)
          .subscribe((accessToken: string) => {
            localStorage.setItem('token', accessToken);
            this.router.navigate(['home']);
          }, () => {
            localStorage.removeItem('token');
            this.router.navigate(['/']);
          });
      } else {
        this.loginService.getLogin()
          .subscribe((linkLogin) => {
            this.googleLoginUrl = linkLogin;
          }, () => {
            localStorage.removeItem('token');
            this.router.navigate(['/']);
          });
      }
    }
  }

  signIn() {
    window.location.href = this.googleLoginUrl
  }
}
