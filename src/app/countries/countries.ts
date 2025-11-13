import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../shared/base-list/base-list';
import { ButtonSharedComponent, InputSharedComponent } from '../shared/shared-components/shared-components';
import { CountriesService, Country } from '../services/countries-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerService } from '../services/spinner';
import { SpinnerComponent } from '../spinner/spinner';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, BaseListComponent, ButtonSharedComponent, InputSharedComponent, ReactiveFormsModule, SpinnerComponent],
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
  });

  isLoading: boolean = false;

  constructor(
    private countriesService: CountriesService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit() {
    this.loadCountries();
  }

  async loadCountries() {
    this.isLoading = true;

    try {
      this.countries = await this.countriesService.getAllCountries();
      console.log('Countries loaded:', this.countries);

      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading countries:', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  editCountry(country: Country) {
    console.log('Edit country:', country);
    // TODO: Implement edit functionality
  }

  deleteCountry(country: Country) {
    if (confirm(`Are you sure you want to set ${country.country_name} as inactive?`)) {
      console.log('Delete country:', country);
      // TODO: Implement delete functionality
    }
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        event.target.value = ''; // Clear the file input
        this.selectedFile = null;
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        event.target.value = '';
        this.selectedFile = null;
        return;
      }
      
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  // Submit the form
  async onSubmit() {
    if (this.countryForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.countryForm.value;
        
        // Prepare the data for the service
        const countryData = {
          country_name: formData.country_name || '',
          country_image: this.selectedFile
        };

        const newCountry = await this.countriesService.addCountry(countryData);
        this.countries.unshift(newCountry);
        
        // Reset the form and file input
        this.countryForm.reset();
        this.selectedFile = null;
        
        // Clear the file input manually
        const fileInput = document.getElementById('country_image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        console.log('Country added successfully:', newCountry);
        this.cdr.detectChanges();
        
        // TODO: Close the popup
      } catch (err) {
        console.error('Error adding country:', err);
        alert('Error adding country. Please try again.');
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
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
    
    // Clear the file input manually
    const fileInput = document.getElementById('country_image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
