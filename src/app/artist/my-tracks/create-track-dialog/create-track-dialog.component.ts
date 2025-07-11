import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ITrack} from "../../../shared/models/track";
import {IGenre} from "../../../shared/models/genre";
import {IMedium} from "../../../shared/models/medium";
import {ArtistService} from "../../artist.service";
import {ImageService} from "../../../core/image.service";
import {IArtist} from "../../../shared/models/artist";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-track-dialog',
  templateUrl: './create-track-dialog.component.html',
  styleUrls: ['./create-track-dialog.component.scss']
})
export class CreateTrackDialogComponent implements OnInit {

  trackForm: FormGroup;
  imageFile?: File;
  imagePreview: string | null = null;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateTrackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      genres: IGenre[],
      mediums: IMedium[],
      artist: IArtist
    },
    private artistService: ArtistService,
    private imageUploadService: ImageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.trackForm = this.fb.group({
      name: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      publishDate: [new Date().toISOString().split('T')[0], Validators.required],
      picture: [''],
      genre: [null, Validators.required],
      records: this.fb.array([])
    });
  }

  get records(): FormArray {
    return this.trackForm.get('records') as FormArray;
  }

  addRecord(medium: IMedium): void {
    this.records.push(this.fb.group({
      medium: [medium.id, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeRecord(index: number): void {
    this.records.removeAt(index);
  }

  isMediumAdded(mediumId: number): boolean {
    return this.records.controls.some(ctrl => ctrl.get('medium')?.value === mediumId);
  }

  getMediumName(mediumId: number): string {
    const medium = this.data.mediums.find(m => m.id === mediumId);
    return medium ? medium.name : 'Unknown Medium';
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

  onSubmit(): void {
    if (this.trackForm.valid) {
      const formValue = this.trackForm.value;

      const newTrack: ITrack = {
        id: 0,
        name: formValue.name,
        duration: formValue.duration,
        publishDate: formValue.publishDate,
        picture: formValue.picture,
        genre: this.data.genres.find(g => g.id === formValue.genre)!,
        artist: this.data.artist,
        records: formValue.records.map((record: any) => ({
          trackId: 0,
          medium: this.data.mediums.find(m => m.id === record.medium)!,
          quantity: record.quantity,
          price: record.price
        }))
      };

      this.isSubmitting = true;
      this.errorMessage = null;

      this.artistService.createTrack(newTrack).subscribe({
        next: (createdTrack: ITrack) => {
          if (this.imageFile) {
            this.imageUploadService.uploadTrackImage(this.imageFile, createdTrack.id).subscribe({
              next: (updatedTrack: ITrack) => {
                this.isSubmitting = false;
                this.dialogRef.close(updatedTrack);
              },
              error: () => {
                this.isSubmitting = false;
                this.errorMessage = 'Image upload failed.';
              }
            });
          } else {
            this.isSubmitting = false;
            this.dialogRef.close(createdTrack);
          }
          this.snackBar.open(`Track successfully created`, '✖', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to create track';
          console.error(err);
          this.snackBar.open('Failed to create track', '✖', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
