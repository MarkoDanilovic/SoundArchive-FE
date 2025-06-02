import { Component, OnInit } from '@angular/core';
import {getDate} from "ngx-bootstrap/chronos/utils/date-getters";
import {FormControl, FormGroup} from "@angular/forms";
import {BasketService} from "../basket.service";
import {BasketComponent} from "../basket.component";

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss']
})
export class CheckoutDialogComponent implements OnInit {

  submitForm: FormGroup

  constructor( private cartService: BasketService) { }

  ngOnInit(): void {
    this.submitForm = new FormGroup({
      // firstName : new FormControl(),
      // lastName : new FormControl(),
      address : new FormControl(),
      city : new FormControl(),
      comment : new FormControl(),
      paymentMethod : new FormControl()
    })
  }

  onSubmit(){
     console.log(this.submitForm)
     //this.cartService.addCart(this.submitForm);
  }

}
