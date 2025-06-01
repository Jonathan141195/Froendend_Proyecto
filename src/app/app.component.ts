import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Proyecto';
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('Rol');
    window.location.href = '/#/login';
  }
  
}
