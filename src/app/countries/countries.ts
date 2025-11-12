import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../shared/base-list/base-list';
import { ButtonSharedComponent, InputSharedComponent } from '../shared/shared-components/shared-components';
import { CountriesService, Country } from '../services/countries-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, BaseListComponent, ButtonSharedComponent, InputSharedComponent, ReactiveFormsModule],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
})
export class Countries implements OnInit {
  pageConfig = {
    title: 'Countries',
    searchPlaceholder: 'Search countries...',
    buttonText: 'Add Country',
    tableColumns: ['Name', 'Image', 'Status', 'Actions'],
    popupTitle: "Add New Country"
  };
  countries: Country[] = [];
  selectedFile: File | null = null;
  
  public countryForm = new FormGroup({
    country_name: new FormControl('', [Validators.required]),
    country_image: new FormControl('') // Remove required validator for image if it's optional
  });

  constructor(
    private countriesService: CountriesService
  ){}

  ngOnInit() {
    this.loadCountries();
  }

  async loadCountries() {
    try {
      this.countries = await this.countriesService.getAllCountries();
      console.log('Countries loaded:', this.countries);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  }

  editCountry(country: Country) {
    console.log('Edit country:', country);
    // TODO: Implement edit functionality
  }

  deleteCountry(country: Country) {
    if (confirm(`Are you sure you want to delete ${country.country_name}?`)) {
      console.log('Delete country:', country);
      // TODO: Implement delete functionality
    }
  }

  // This method handles the button click to open the popup
  onAddButtonClick() {
    console.log('Add new country button clicked');
    // The popup will open automatically via BaseListComponent
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.countryForm.patchValue({
        country_image: file.name
      });
    }
  }

  // Submit the form
  async onSubmit() {
    if (this.countryForm.valid) {
      try {
        const formData = this.countryForm.value;
        
        // Prepare the data for the service
        const countryData = {
          country_name: formData.country_name || '',
          country_image: formData.country_image || ''
        };

        const newCountry = await this.countriesService.addCountry(countryData);
        this.countries.unshift(newCountry); // Add to the beginning of the list
        
        // Reset the form
        this.countryForm.reset();
        this.selectedFile = null;
        
        console.log('Country added successfully:', newCountry);
        
        // TODO: Close the popup - you might need to emit an event to BaseListComponent
      } catch (err) {
        console.error('Error adding country:', err);
        alert('Error adding country. Please try again.');
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched() {
    Object.keys(this.countryForm.controls).forEach(key => {
      const control = this.countryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Form control getters for easy template access
  get countryName() {
    return this.countryForm.get('country_name');
  }

  get countryImage() {
    return this.countryForm.get('country_image');
  }

  // Cancel form and reset
  onCancel() {
    this.countryForm.reset();
    this.selectedFile = null;
    // TODO: Close the popup
  }
}
