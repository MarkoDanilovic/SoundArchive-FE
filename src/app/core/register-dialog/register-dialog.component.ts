import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {RegisterUser} from "../../shared/models/registerUser";
import {LoggingService} from "../logging.service";

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {

  invalidRegister: boolean;

  @Output() registrationSuccess: EventEmitter<string> = new EventEmitter<string>(); // Emit username on successful registration

  constructor(private service: LoggingService) { }

  public user : RegisterUser = new RegisterUser()

  ngOnInit(): void {
  }

  register(registerForm: NgForm) {
    this.user.firstName = registerForm.value.firstName
    this.user.lastName = registerForm.value.lastName
    this.user.dateOfBirth = registerForm.value.dateOfBirth
    this.user.email = registerForm.value.email
    //this.user.displayName = registerForm.value.displayName
    this.user.description = registerForm.value.description
    this.user.socialMediaLink = registerForm.value.socialMediaLink
    this.user.phoneNumber = registerForm.value.phoneNumber
    this.user.address = registerForm.value.address
    this.user.city = registerForm.value.city
    this.user.country = registerForm.value.country
    this.user.creditCardNumber = registerForm.value.creditCardNumber

    this.user.username = registerForm.value.username
    this.user.password1 = registerForm.value.password1
    this.user.password2 = registerForm.value.password2

    this.service.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.invalidRegister = false;
        this.registrationSuccess.emit(response.username);
      },
      error: (error) => {
        console.log('Error registering user:', error);
        this.invalidRegister = true;
      }
    });
  }
}
