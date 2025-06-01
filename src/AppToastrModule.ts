import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot()  // Configuramos Toastr aquí
  ],
  exports: [
    BrowserAnimationsModule,
    ToastrModule
  ]
})
export class AppToastrModule {}
