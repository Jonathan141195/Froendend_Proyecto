import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms'; 



@Component({
  selector: 'app-login',
  imports: [
    FormsModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  clave: string = '';

  constructor(private http: HttpClient) {}

  login() {
    const params = new HttpParams()
      .set('CorreoElectronico', this.correo)
      .set('Password', this.clave);
  
    this.http.get('http://localhost/usuario/autenticar', {
      params,
      responseType: 'text'
    }).subscribe({
      next: (response: string) => {
        if (!response || response === 'false') {
          alert('Usuario o contraseña incorrectos.');
          return;
        }
  
        localStorage.setItem('token', response);
  
        const decoded: any = jwtDecode(response);
        const rol = decoded.data;
  
        localStorage.setItem('Rol', String(rol)); // ✅ Guardar Rol correctamente
  
        if (rol === 1) {
          window.location.href = '/#/admin';
        } else if (rol === 2) {
          window.location.href = '/#/usuario';
        } else {
          window.location.href = '/#/dashboard';
        }
      },
      error: () => {
        alert('Error de conexión con el servidor.');
      }
    });
  }
  
}
