import { Component, OnInit } from '@angular/core';
import {AdminService} from "../admin.service";
import {IGenre} from "../../shared/models/genre";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {
  genres: IGenre[] = [];
  newGenreName = '';
  editingId: number | null = null;
  editedName = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres() {
    this.adminService.getGenres().subscribe({
      next: res => this.genres = res,
      error: err => console.error('Failed to load genres', err)
    });
  }

  addGenre() {
    if (!this.newGenreName.trim()) return;
    this.adminService.addGenre(this.newGenreName).subscribe({
      next: genre => {
        this.genres = [...this.genres, genre];
        this.newGenreName = '';
      },
      error: err => console.error('Failed to add genre', err)
    });
  }

  deleteGenre(id: number) {
    if (!confirm('Are you sure you want to delete this genre?')) {
      return;
    }

    this.adminService.deleteGenre(id).subscribe({
      next: () => this.genres = this.genres.filter(g => g.id !== id),
      error: err => console.error('Failed to delete genre', err)
    });
  }

  startEdit(genre: IGenre) {
    this.editingId = genre.id;
    this.editedName = genre.name;
  }

  cancelEdit() {
    this.editingId = null;
    this.editedName = '';
  }

  saveEdit(genre: IGenre) {
    const updatedGenre: IGenre = { ...genre, name: this.editedName };
    this.adminService.updateGenre(updatedGenre).subscribe({
      next: res => {
        const index = this.genres.findIndex(g => g.id === res.id);
        if (index !== -1) {
          // Replace the updated genre and reassign the array to trigger change detection
          const updatedGenres = [...this.genres];
          updatedGenres[index] = res;
          this.genres = updatedGenres;
        }
        this.cancelEdit();
      },
      error: err => console.error('Failed to update genre', err)
    });
  }
}
