import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule, // Necesario para Toastr
    ToastrModule.forRoot()   // Asegúrate de que ToastrModule esté configurado globalmente
  ],
  exports: [
    ToastrModule             // Exporta ToastrModule
  ]
})
export class AppToastrModule {}

