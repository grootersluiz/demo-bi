import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _regdashsService: RegdashsService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set userID(id: string) {
        localStorage.setItem('id', id);
    }

    get userID(): string {
        return localStorage.getItem('id') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        const myCrendentials = {
            username: credentials.email,
            password: credentials.password,
        };

        return this._httpClient
            .post('http://10.2.1.108/v1/users/login', myCrendentials)
            .pipe(
                switchMap((response: any) => {
                    const myResponse = {
                        accessToken: response.token,
                        tokenType: 'bearer',
                        id: response.id,
                        user: {
                            ...response,
                            status: 'online',
                            avatar: '',
                        },

                    };

                    // Store the access token in the local storage
                    this.accessToken = myResponse.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = myResponse.user;

                    this.userID = myResponse.id;
                    // Retorna a lista de dashboards antes de retornar a resposta do signIn

                    return this._regdashsService.getDashs().pipe(
                        switchMap(() => {
                            // Return a new observable with the response
                            return of(myResponse);
                        })
                    );
                })
            );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.get('http://10.2.1.108/v1/users/sing_in').pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                const myResponse = {
                    accessToken: this.accessToken,
                    tokenType: 'bearer',
                    user: {
                        ...response,
                        status: 'online',
                        avatar: '',
                    },
                };

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.

                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = myResponse.user;

                // Retorna a lista de dashboards antes de retornar a resposta do signInUsingToken

                return this._regdashsService.getDashs().pipe(
                    switchMap(() => {
                        // Return true
                        return of(true);
                    })
                );
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
