import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Cart} from "../../shared/models/cart";

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss']
})
export class CheckoutDialogComponent implements OnInit {
  submitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CheckoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cart: Cart }
  ) {}

  ngOnInit(): void {
    const cart = this.data?.cart ?? {} as Cart;

    this.submitForm = this.fb.group({
      address: [cart.address ?? '', Validators.required],
      city: [cart.city ?? '', Validators.required],
      country: [cart.country ?? '', Validators.required],
      postalCode: [cart.postalCode ?? '', Validators.required],
      paymentMethod: [cart.paymentMethod ?? '', Validators.required],
      comment: [cart.comment ?? '']
    });
  }

  onSubmit(): void {
    if (this.submitForm.invalid) return;

    const formValues = this.submitForm.value;

    const updatedCart: Cart = {
      ...this.data.cart,
      ...formValues
    };

    this.dialogRef.close(updatedCart);
  }
}
