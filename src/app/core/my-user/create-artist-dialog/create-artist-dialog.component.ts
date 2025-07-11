import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../logging.service";
import {IArtist} from "../../../shared/models/artist";
import {ImageService} from "../../image.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-artist-dialog',
  templateUrl: './create-artist-dialog.component.html',
  styleUrls: ['./create-artist-dialog.component.scss']
})
export class CreateArtistDialogComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  imageFile?: File;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateArtistDialogComponent>,
    private imageUploadService: ImageService,
    private logService: LoggingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      artistName: ['', Validators.required],
      firstName: [''],//, Validators.required],
      lastName: [''],//, Validators.required],
      birthday: ['', Validators.required],
      country: ['', Validators.required],
      picture: [''],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.imageFile = input.files[0];

      // Show image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const artistData: IArtist = { ...this.form.value };
    delete artistData.picture;

    this.logService.createArtist(artistData).subscribe({
      next: (artist: IArtist) => {
        if (this.imageFile) {
          this.imageUploadService.uploadArtistImage(this.imageFile, artist.id).subscribe({
            next: (updatedArtist: IArtist) => {
              this.isSubmitting = false;
              this.dialogRef.close(updatedArtist);
            }
          });
        } else {
          this.isSubmitting = false;
          this.dialogRef.close(artist);
        }
        // this.snackBar.open(`Artist created successfully`, '✖', {
        //   duration: 3000,
        //   panelClass: ['snackbar-success'],
        //   horizontalPosition: 'end',
        //   verticalPosition: 'bottom'
        // });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to create artist';

        this.snackBar.open('Failed to create artist', '✖', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
    });
  }



  cancel(): void {
    this.dialogRef.close(null);
  }
}
