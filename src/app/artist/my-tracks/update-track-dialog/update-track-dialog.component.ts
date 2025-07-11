import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ITrack} from "../../../shared/models/track";
import {IGenre} from "../../../shared/models/genre";
import {IMedium} from "../../../shared/models/medium";
import {ArtistService} from "../../artist.service";
import {IArtist} from "../../../shared/models/artist";
import {ImageService} from "../../../core/image.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-track-dialog',
  templateUrl: './update-track-dialog.component.html',
  styleUrls: ['./update-track-dialog.component.scss']
})
export class UpdateTrackDialogComponent implements OnInit {

  trackForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  imageFile?: File;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateTrackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { track: ITrack; genres: IGenre[]; mediums: IMedium[] },
    private artistService: ArtistService,
    private imageUploadService: ImageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const formattedDate = this.data.track.publishDate?.split('T')?.[0] ?? '';

    this.trackForm = this.fb.group({
      name: [this.data.track.name, Validators.required],
      duration: [this.data.track.duration, [Validators.required, Validators.min(1)]],
      publishDate: [formattedDate, Validators.required],
      picture: [this.data.track.picture],
      genre: [this.data.track.genre.id, Validators.required],
      records: this.fb.array(this.createRecords())
    });
  }

  // get records() {
  //   return this.trackForm.get('records'); // For managing record list
  // }

  createRecords(): any[] {
    return this.data.track.records.map(record => this.fb.group({
      medium: [record.medium.id, Validators.required],
      quantity: [record.quantity, [Validators.required, Validators.min(1)]],
      price: [record.price, [Validators.required, Validators.min(0)]]
    }));
  }

  get records(): FormArray {
    return this.trackForm.get('records') as FormArray;
  }

  getMediumName(mediumId: number): string {
    const medium = this.data.mediums.find(m => m.id === mediumId);
    return medium ? medium.name : 'Unknown Medium';
  }

  isMediumAdded(mediumId: number): boolean {
    return this.records.controls.some(ctrl => ctrl.get('medium')?.value === mediumId);
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

      const updatedTrack: ITrack = {
        ...this.data.track,
        name: formValue.name,
        duration: formValue.duration,
        publishDate: formValue.publishDate,
        picture: formValue.picture,
        genre: this.data.genres.find(g => g.id === formValue.genre)!,
        records: formValue.records.map((record: any) => ({
          trackId: this.data.track.id,
          medium: this.data.mediums.find(m => m.id === record.medium)!,
          quantity: record.quantity,
          price: record.price
        })),
        artist: this.data.track.artist //not editable
      };

      this.isSubmitting = true;
      this.errorMessage = null;

      this.artistService.updateTrack(updatedTrack).subscribe({
        next: (savedTrack ) => {
          if (this.imageFile) {
            this.imageUploadService.uploadTrackImage(this.imageFile, savedTrack.id).subscribe({
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
            this.dialogRef.close(savedTrack);
          }
          this.snackBar.open(`Track successfully updated`, '✖', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to update track';
          console.error('Failed to update track', error);
          this.snackBar.open('Failed to update track', '✖', {
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
