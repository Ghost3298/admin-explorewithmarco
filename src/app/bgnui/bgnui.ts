import { Component, OnInit } from '@angular/core';
import { ButtonSharedComponent } from "../shared/shared-components/shared-components";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bgnui',
  imports: [ButtonSharedComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './bgnui.html',
  styleUrl: './bgnui.css',
})
export class Bgnui implements OnInit {
  backgroundForm!: FormGroup;
  uiForm!: FormGroup;
  customBackgroundImage: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForms();
    this.loadSavedSettings();
  }

  initializeForms() {
    this.backgroundForm = this.fb.group({
      bgType: ['default'],
      bgColor: ['#ffffff'],
      bgImage: [null]
    });

    this.uiForm = this.fb.group({
      primaryColor: ['#013a63'],
      secondaryColor: ['#00bcd4'],
      textColor: ['#333333'],
      backgroundColor: ['#ffffff']
    });
  }

  loadSavedSettings() {
    // Load from localStorage or API
    const savedBg = localStorage.getItem('backgroundSettings');
    const savedUI = localStorage.getItem('uiSettings');
    
    if (savedBg) this.backgroundForm.patchValue(JSON.parse(savedBg));
    if (savedUI) this.uiForm.patchValue(JSON.parse(savedUI));
  }

  onBackgroundUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.customBackgroundImage = e.target.result;
        this.backgroundForm.patchValue({ bgImage: this.customBackgroundImage });
      };
      reader.readAsDataURL(file);
    }
  }

  getBackgroundPreview(): string {
    const bgType = this.backgroundForm.get('bgType')?.value;
    
    switch(bgType) {
      case 'custom':
        if (this.customBackgroundImage) {
          return `url(${this.customBackgroundImage}) center/cover`;
        }
        return this.backgroundForm.get('bgColor')?.value;
      case 'none':
        return 'transparent';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  getUIPreview(): string {
    return `background-color: ${this.uiForm.get('backgroundColor')?.value}`;
  }

  saveBackground() {
    const settings = this.backgroundForm.value;
    localStorage.setItem('backgroundSettings', JSON.stringify(settings));
    // Apply to actual website
    this.applyBackgroundToSite();
    alert('Background settings saved!');
  }

  saveUIColors() {
    const settings = this.uiForm.value;
    localStorage.setItem('uiSettings', JSON.stringify(settings));
    // Apply to actual website
    this.applyUIColorsToSite();
    alert('UI colors saved!');
  }

  applyBackgroundToSite() {
    // Implement logic to apply background to your actual site
    document.body.style.background = this.getBackgroundPreview();
  }

  applyUIColorsToSite() {
    // Implement logic to apply UI colors to your actual site
    const colors = this.uiForm.value;
    document.documentElement.style.setProperty('--primary-color', colors.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', colors.secondaryColor);
    // ... etc
  }

  applyTheme(theme: string) {
    const themes: any = {
      light: { primaryColor: '#013a63', secondaryColor: '#00bcd4', textColor: '#333333', backgroundColor: '#ffffff' },
      dark: { primaryColor: '#bb86fc', secondaryColor: '#03dac6', textColor: '#ffffff', backgroundColor: '#121212' },
      blue: { primaryColor: '#1976d2', secondaryColor: '#42a5f5', textColor: '#ffffff', backgroundColor: '#e3f2fd' }
    };
    
    this.uiForm.patchValue(themes[theme]);
  }

  resetBackground() {
    this.backgroundForm.reset({ bgType: 'default', bgColor: '#ffffff' });
    this.customBackgroundImage = null;
  }

  resetUI() {
    this.uiForm.reset({
      primaryColor: '#013a63',
      secondaryColor: '#00bcd4', 
      textColor: '#333333',
      backgroundColor: '#ffffff'
    });
  }
}