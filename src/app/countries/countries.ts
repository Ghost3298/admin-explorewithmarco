import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../shared/base-list/base-list';
import { ButtonSharedComponent, InputSharedComponent } from '../shared/shared-components/shared-components';
import { CountriesService, Country } from '../services/countries-service';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, BaseListComponent, ButtonSharedComponent, InputSharedComponent],
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
      console.log('Array length:', this.countries.length);
      console.log('Is array?', Array.isArray(this.countries));
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  }

  editCountry(country: any) {
    console.log('Edit country:', country);
    // TODO: Implement edit functionality
  }

  deleteCountry(country: any) {
    if (confirm(`Are you sure you want to delete ${country.name}?`)) {
      console.log('Delete country:', country);
      // TODO: Implement delete functionality
    }
  }

  addCountry() {
    console.log('Add new country');
    // TODO: Implement add country functionality
  }
}