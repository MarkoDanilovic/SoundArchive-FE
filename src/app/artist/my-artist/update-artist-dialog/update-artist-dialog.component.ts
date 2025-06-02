import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IArtist} from "../../../shared/models/artist";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ArtistService} from "../../artist.service";
import {ImageUploadService} from "../../../core/image-upload.service";

@Component({
  selector: 'app-update-artist-dialog',
  templateUrl: './update-artist-dialog.component.html',
  styleUrls: ['./update-artist-dialog.component.scss']
})
export class UpdateArtistDialogComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  imageFile?: File;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateArtistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IArtist,
    private artistService: ArtistService,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    const formattedDate = this.data.birthday?.split('T')?.[0] ?? '';

    this.form = this.fb.group({
      id: [this.data.id],
      artistName: [this.data.artistName, Validators.required],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      birthday: [formattedDate, Validators.required],
      country: [this.data.country, Validators.required],
      picture: ['']
    });

    if (this.data.picture) {
      this.imagePreview = this.data.picture.startsWith('http') ? this.data.picture : null;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.imageFile = input.files[0];

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

    const updatedArtist: IArtist = { ...this.form.value };
    delete updatedArtist.picture;

    this.artistService.updateArtist(updatedArtist).subscribe({
      next: (savedArtist: IArtist) => {
        if (this.imageFile) {
          this.imageUploadService.uploadArtistImage(this.imageFile, savedArtist.id).subscribe({
            next: (updatedArtist: IArtist) => {
              this.isSubmitting = false;
              this.dialogRef.close(updatedArtist);
            },
            error: () => {
              this.isSubmitting = false;
              this.errorMessage = 'Image upload failed.';
            }
          });
        } else {
          this.isSubmitting = false;
          this.dialogRef.close(savedArtist);
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to update artist.';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
