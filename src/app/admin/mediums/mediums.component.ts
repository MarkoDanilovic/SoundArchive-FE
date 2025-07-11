import { Component, OnInit } from '@angular/core';
import {AdminService} from "../admin.service";
import {IMedium} from "../../shared/models/medium";

@Component({
  selector: 'app-mediums',
  templateUrl: './mediums.component.html',
  styleUrls: ['./mediums.component.scss']
})
export class MediumsComponent implements OnInit {

  mediums: IMedium[] = [];
  newMediumName = '';
  editingId: number | null = null;
  editedName = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadMediums();
  }

  loadMediums() {
    this.adminService.getMediums().subscribe({
      next: res => this.mediums = res,
      error: err => console.error('Failed to load mediums', err)
    });
  }

  addMedium() {
    if (!this.newMediumName.trim()) return;
    this.adminService.addMedium(this.newMediumName).subscribe({
      next: medium => {
        this.mediums = [...this.mediums, medium];
        this.newMediumName = '';
      },
      error: err => console.error('Failed to add medium', err)
    });
  }

  deleteMedium(id: number) {
    if (!confirm('Are you sure you want to delete this medium?')) {
      return;
    }

    this.adminService.deleteMedium(id).subscribe({
      next: () => this.mediums = this.mediums.filter(g => g.id !== id),
      error: err => console.error('Failed to delete medium', err)
    });
  }

  startEdit(medium: IMedium) {
    this.editingId = medium.id;
    this.editedName = medium.name;
  }

  cancelEdit() {
    this.editingId = null;
    this.editedName = '';
  }

  saveEdit(medium: IMedium) {
    const updatedMedium: IMedium = { ...medium, name: this.editedName };
    this.adminService.updateMedium(updatedMedium).subscribe({
      next: res => {
        const index = this.mediums.findIndex(g => g.id === res.id);
        if (index !== -1) {
          // Replace the updated medium and reassign the array to trigger change detection
          const updatedMediums = [...this.mediums];
          updatedMediums[index] = res;
          this.mediums = updatedMediums;
        }
        this.cancelEdit();
      },
      error: err => console.error('Failed to update medium', err)
    });
  }

}
