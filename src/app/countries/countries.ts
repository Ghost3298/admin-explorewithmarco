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
  filteredCountries: Country[] = [];
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;
  isEditMode: boolean = false;
  editingCountry: Country | null = null;
  searchTerm: string = '';
  
  // Add Country Form
  public countryForm = new FormGroup({
    country_name: new FormControl('', [Validators.required]),
  });

  // Edit Country Form
  public editCountryForm = new FormGroup({
    country_name: new FormControl('', [Validators.required]),
    status: new FormControl(true)
  });

  isLoading: boolean = false;
  showEditPopup: boolean = false;

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
      this.filteredCountries = [...this.countries]; // Initialize filtered list
      console.log('Countries loaded:', this.countries);

      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading countries:', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Search functionality
  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.filterCountries();
  }

  filterCountries() {
    if (!this.searchTerm) {
      this.filteredCountries = [...this.countries];
    } else {
      this.filteredCountries = this.countries.filter(country =>
        country.country_name.toLowerCase().includes(this.searchTerm)
      );
    }
    this.cdr.detectChanges();
  }

  editCountry(country: Country) {
    console.log('Edit country:', country);
    this.isEditMode = true;
    this.editingCountry = country;
    this.showEditPopup = true;
    
    // Populate the edit form with current values
    this.editCountryForm.patchValue({
      country_name: country.country_name,
      status: country.status
    });
    
    this.selectedEditFile = null;
    this.cdr.detectChanges();
  }

  async updateCountryStatus(country: Country) {
    const newStatus = !country.status;
    const action = newStatus ? 'active' : 'inactive';
    
    if (confirm(`Are you sure you want to set ${country.country_name} as ${action}?`)) {
      this.isLoading = true;
      try {
        const updatedCountry = await this.countriesService.updateCountry({
          id: country.id,
          status: newStatus
        });
        
        // Update the country in the local array
        const index = this.countries.findIndex(c => c.id === country.id);
        if (index !== -1) {
          this.countries[index] = updatedCountry;
        }
        
        // Also update in filtered array if it exists there
        const filteredIndex = this.filteredCountries.findIndex(c => c.id === country.id);
        if (filteredIndex !== -1) {
          this.filteredCountries[filteredIndex] = updatedCountry;
        }
        
        console.log(`Country status updated to ${action}:`, updatedCountry);
        this.cdr.detectChanges();
        
      } catch (err) {
        console.error('Error updating country status:', err);
        alert('Error updating country status. Please try again.');
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }
  }

  // Handle file selection for add form
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        event.target.value = '';
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

  // Handle file selection for edit form
  onEditFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        event.target.value = '';
        this.selectedEditFile = null;
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        event.target.value = '';
        this.selectedEditFile = null;
        return;
      }
      
      this.selectedEditFile = file;
    } else {
      this.selectedEditFile = null;
    }
  }

  // Submit the add form
  async onSubmit() {
    if (this.countryForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.countryForm.value;
        
        const countryData = {
          country_name: formData.country_name || '',
          country_image: this.selectedFile
        };

        const newCountry = await this.countriesService.addCountry(countryData);
        this.countries.unshift(newCountry);
        this.filteredCountries.unshift(newCountry); // Also add to filtered list
        
        // Reset the form
        this.countryForm.reset();
        this.selectedFile = null;
        
        // Clear the file input
        const fileInput = document.getElementById('country_image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        console.log('Country added successfully:', newCountry);
        this.cdr.detectChanges();
        
      } catch (err) {
        console.error('Error adding country:', err);
        
        // Simple error message for now
        if (err instanceof Error) {
          alert(`Error: ${err.message}`);
        } else {
          alert('Error adding country. Please try again.');
        }
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  // Submit the edit form
  async onEditSubmit() {
    if (this.editCountryForm.valid && this.editingCountry) {
      this.isLoading = true;
      try {
        const formData = this.editCountryForm.value;
        
        const updateData = {
          id: this.editingCountry.id,
          country_name: formData.country_name || '',
          country_image: this.selectedEditFile,
          status: formData.status || false
        };

        const updatedCountry = await this.countriesService.updateCountry(updateData);
        
        // Update the country in both arrays
        const index = this.countries.findIndex(c => c.id === this.editingCountry!.id);
        if (index !== -1) {
          this.countries[index] = updatedCountry;
        }
        
        const filteredIndex = this.filteredCountries.findIndex(c => c.id === this.editingCountry!.id);
        if (filteredIndex !== -1) {
          this.filteredCountries[filteredIndex] = updatedCountry;
        }
        
        // Close the edit popup and reset
        this.closeEditPopup();
        
        console.log('Country updated successfully:', updatedCountry);
        this.cdr.detectChanges();
        
      } catch (err) {
        console.error('Error updating country:', err);
        
        if (err instanceof Error) {
          alert(`Error: ${err.message}`);
        } else {
          alert('Error updating country. Please try again.');
        }
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.markEditFormGroupTouched();
    }
  }

  // Helper method to mark all form controls as touched for add form
  private markFormGroupTouched() {
    Object.keys(this.countryForm.controls).forEach(key => {
      const control = this.countryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to mark all form controls as touched for edit form
  private markEditFormGroupTouched() {
    Object.keys(this.editCountryForm.controls).forEach(key => {
      const control = this.editCountryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Close edit popup and reset
  closeEditPopup() {
    this.showEditPopup = false;
    this.isEditMode = false;
    this.editingCountry = null;
    this.selectedEditFile = null;
    this.editCountryForm.reset({ status: true });
    
    // Clear the edit file input
    const fileInput = document.getElementById('edit_country_image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // Cancel add form and reset
  onCancel() {
    this.countryForm.reset();
    this.selectedFile = null;
    
    // Clear the file input manually
    const fileInput = document.getElementById('country_image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Cancel edit form and reset
  onEditCancel() {
    this.closeEditPopup();
  }

  // Form control getters for easy template access - Add Form
  get countryName() {
    return this.countryForm.get('country_name');
  }

  // Form control getters for easy template access - Edit Form
  get editCountryName() {
    return this.editCountryForm.get('country_name');
  }

  get editCountryStatus() {
    return this.editCountryForm.get('status');
  }
}