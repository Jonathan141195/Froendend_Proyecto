import { Routes } from '@angular/router';
import {ProvinciasComponent } from './provincias/provincias.component';
import {CantonesComponent } from './cantones/cantones.component';
import {DistritosComponent } from './distritos/distritos.component';
import {UsuariosComponent } from './usuarios/usuarios.component';
import {SedesComponent } from './sedes/sedes.component';
import {EstudiantesComponent } from './estudiantes/estudiantes.component';
import {CarrerasComponent } from './carreras/carreras.component';
import {MateriasComponent } from './materias/materias.component';
import {CrearPagoComponent } from './crear-pago/crear-pago.component';
import {DocentesComponent } from './docentes/docentes.component';
import {CursosComponent } from './cursos/cursos.component';
import {PagoComponent } from './pago/pago.component';
import {HomeComponent } from './home/home.component';
import {MatriculaComponent } from './matricula/matricula.component';
import {PlanEstudioComponent } from './plan-estudio/plan-estudio.component';
import {OfertaAcademicaComponent } from './oferta-academica/oferta-academica.component';
import {HistoricoAcademicoComponent } from './historico-academico/historico-academico.component';
import { CrearCantonComponent } from './crear-canton/crear-canton.component';
import { CrearDistritoComponent } from './crear-distrito/crear-distrito.component';
import { CrearSedeComponent } from './crear-sede/crear-sede.component';
import { LoginComponent } from './login/login.component';
import { CrearEstudianteComponent } from './crear-estudiante/crear-estudiante.component';
import { CrearDocenteComponent } from './crear-docente/crear-docente.component';
import { CrearCarreraComponent } from './crear-carrera/crear-carrera.component';
import { CrearMateriaComponent } from './crear-materia/crear-materia.component';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { CrearCursoComponent } from './crear-curso/crear-curso.component';
import { CrearMatriculaComponent } from './crear-matricula/crear-matricula.component';
import { CrearPlanEstudioComponent } from './crear-plan-estudio/crear-plan-estudio.component'
import { CrearHistoricoAcademicoComponent } from './crear-historico-academico/crear-historico-academico.component'
import { CrearOfertaAcademicaComponent } from './crear-oferta-academica/crear-oferta-academica.component'
import { EditarEstudianteComponent } from './editar-estudiante/editar-estudiante.component';
import { EditarSedeComponent } from './editar-sede/editar-sede.component';
import { EditarCursoComponent } from './editar-curso/editar-curso.component';
import { EditarDocenteComponent } from './editar-docente/editar-docente.component';
import { EditarMateriaComponent } from './editar-materia/editar-materia.component';
import { EditarMatriculaComponent } from './editar-matricula/editar-matricula.component';
import { EditarCarreraComponent } from './editar-carrera/editar-carrera.component';
import { EditarUsuariosComponent } from './editar-usuarios/editar-usuarios.component';
import { EditarPlanEstudioComponent } from './editar-plan-estudio/editar-plan-estudio.component';
import { EditarHistoricoAcademicoComponent } from './editar-historico-academico/editar-historico-academico.component';
import { EditarOfertaAcademicaComponent } from './editar-oferta-academica/editar-oferta-academica.component';

export const routes: Routes = [
    {
    
        path:'Provincias',
        component:ProvinciasComponent
    },

    {
        path: '',
        component: HomeComponent
      },
    {
    
        path:'Cantones',
        component:CantonesComponent
    },
    {
    
        path:'Distritos',
        component:DistritosComponent
    },

    {
    
        path:'Login',
        component:LoginComponent
    },
    {
    
        path:'Sedes',
        component:SedesComponent
    },

    {
    
        path:'Pago',
        component:PagoComponent
    },

    {
    
        path:'CrearPago/:id',
        component:CrearPagoComponent
    },
    {
    
        path:'Usuario',
        component:UsuariosComponent
    },
    {
     path:'Estudiantes',
        component:EstudiantesComponent
    },
    {
        path:'Estudiantes',
           component:EstudiantesComponent
       },
    {
     path:'PlanEstudio',
        component:PlanEstudioComponent
    },
    {
        path:'Materias',
           component:MateriasComponent
       },
       {
        path:'Carreras',
           component:CarrerasComponent
       },

       {
        path:'Matricula',
           component:MatriculaComponent
       },
       {
        path:'Matricular',
           component:CrearMatriculaComponent
       },
       {
        path:'HistoricoAcademico',
           component:HistoricoAcademicoComponent
       },
       {
        path:'OfertaAcademica',
           component:OfertaAcademicaComponent
       },
       {
        path:'CrearCanton',
           component:CrearCantonComponent
       },
       {
        path:'CrearDistrito',
           component:CrearDistritoComponent
       },
       {
        path:'CrearSede',
           component:CrearSedeComponent
       },
       {
        path:'CrearEstudiante',
           component:CrearEstudianteComponent
       },
       {
        path:'CrearDocente',
           component:CrearDocenteComponent
       },

       {
        path:'CrearUsuario',
           component:CrearUsuariosComponent
       },
       {
        path:'CrearMatricula',
           component:CrearMatriculaComponent
       },
       {
        path:'Docentes',
           component:DocentesComponent
       },
       {
        path:'CrearOfertaAcademica',
           component:CrearOfertaAcademicaComponent
       },
       {
       path:'Cursos',
       component:CursosComponent
   },
       {
        path:'CrearCarrera',
           component:CrearCarreraComponent
       },
       {
        path:'CrearCurso',
           component:CrearCursoComponent
       },
       {
        path:'CrearMateria',
           component:CrearMateriaComponent
       },
       {
        path:'CrearPlanEstudio',
           component:CrearPlanEstudioComponent
       },
       {
        path:'CrearHistoricoAcademico',
           component:CrearHistoricoAcademicoComponent
       },
       {
        path:'HistoricoAcademico',
           component:CrearHistoricoAcademicoComponent
       },
       {
       path:'EditarEstudiante/:id',
       component:EditarEstudianteComponent
   },
   {
    path:'EditarSede/:id',
    component:EditarSedeComponent
},

{
    path:'EditarDocente/:id',
    component:EditarDocenteComponent
},

{
    path:'EditarMateria/:id',
    component:EditarMateriaComponent
},
{
    path:'EditarMatricula/:id',
    component:EditarMatriculaComponent
},
{
    path:'EditarCarrera/:id',
    component:EditarCarreraComponent
},

{
    path:'EditarCurso/:id',
    component:EditarCursoComponent
},
{
    path:'EditarUsuario/:id',
    component:EditarUsuariosComponent
},
{
    path:'EditarPlanEstudio/:id',
    component:EditarPlanEstudioComponent
},

{
    path:'EditarHistoricoAcademico/:id',
    component:EditarHistoricoAcademicoComponent
},
{
    path:'EditarOfertaAcademica/:id',
    component:EditarOfertaAcademicaComponent
},

];
