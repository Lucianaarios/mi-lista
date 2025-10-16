import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService, AgendaItem } from './services/agenda.service';
import { LucideAngularModule, Calendar, Clock, Plus, Trash2, Check, X, AlertCircle, CheckCircle, Info, Flame, Zap, Droplet, CalendarDays, ListTodo, TrendingUp, Filter, Briefcase, BookOpen, Heart, Coffee, ShoppingBag, Play, Menu, Home, Settings, User, LogOut, Edit } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Mi Agenda Diaria';
  agendaItems: AgendaItem[] = [];
  cargando = false;
  error: string | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  // Estado del modal
  mostrarModal = false;
  itemEditando: AgendaItem | null = null;

  // Iconos de Lucide
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Check = Check;
  readonly X = X;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Info = Info;
  readonly Flame = Flame;
  readonly Zap = Zap;
  readonly Droplet = Droplet;
  readonly CalendarDays = CalendarDays;
  readonly ListTodo = ListTodo;
  readonly TrendingUp = TrendingUp;
  readonly Filter = Filter;
  readonly Briefcase = Briefcase;
  readonly BookOpen = BookOpen;
  readonly Heart = Heart;
  readonly Coffee = Coffee;
  readonly ShoppingBag = ShoppingBag;
  readonly Play = Play;
  readonly Menu = Menu;
  readonly Home = Home;
  readonly Settings = Settings;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Edit = Edit;

  constructor(private agendaService: AgendaService) {}

  nuevoItem = {
    hora: '09:00',
    titulo: '',
    descripcion: '',
    categoria: 'trabajo',
    prioridad: 'media' as 'alta' | 'media' | 'baja'
  };

  categorias = ['trabajo', 'estudio', 'salud', 'rutina', 'ocio', 'compras'];
  filtroCategoria: string = 'todas';

  ngOnInit() {
    this.cargarItems();
  }

  cargarItems() {
    this.cargando = true;
    this.error = null;
    this.agendaService.getAll().subscribe({
      next: (items) => {
        this.agendaItems = items;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar actividades:', err);
        this.error = 'No se pudieron cargar las actividades. Verifica que el servidor backend esté corriendo.';
        this.cargando = false;
      }
    });
  }

  get itemsFiltrados(): AgendaItem[] {
    if (this.filtroCategoria === 'todas') {
      return this.agendaItems.sort((a, b) => a.hora.localeCompare(b.hora));
    }
    return this.agendaItems
      .filter(item => item.categoria === this.filtroCategoria)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  agregarItem() {
    if (this.nuevoItem.titulo.trim() && this.nuevoItem.hora.trim()) {
      const nuevoItem = {
        hora: this.nuevoItem.hora,
        titulo: this.nuevoItem.titulo,
        descripcion: this.nuevoItem.descripcion,
        completado: false,
        categoria: this.nuevoItem.categoria,
        prioridad: this.nuevoItem.prioridad
      };

      this.agendaService.create(nuevoItem).subscribe({
        next: (item) => {
          this.agendaItems.unshift(item);
          this.resetForm();
          this.showToast('Actividad agregada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al crear actividad:', err);
          this.showToast('No se pudo agregar la actividad', 'error');
        }
      });
    } else {
      this.showToast('Por favor completa los campos requeridos', 'error');
    }
  }

  eliminarItem(id: number) {
    this.agendaService.delete(id).subscribe({
      next: () => {
        this.agendaItems = this.agendaItems.filter(item => item.id !== id);
        this.showToast('Actividad eliminada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al eliminar actividad:', err);
        this.showToast('No se pudo eliminar la actividad', 'error');
      }
    });
  }

  toggleCompletado(id: number) {
    const item = this.agendaItems.find(i => i.id === id);
    if (item) {
      const nuevoEstado = !item.completado;
      this.agendaService.update(id, { completado: nuevoEstado }).subscribe({
        next: (updatedItem) => {
          item.completado = updatedItem.completado;
          const mensaje = nuevoEstado ? 'Actividad completada' : 'Actividad marcada como pendiente';
          this.showToast(mensaje, 'success');
        },
        error: (err) => {
          console.error('Error al actualizar actividad:', err);
          this.showToast('No se pudo actualizar la actividad', 'error');
        }
      });
    }
  }

  get tareasPendientes(): number {
    return this.agendaItems.filter(item => !item.completado).length;
  }

  get tareasCompletadas(): number {
    return this.agendaItems.filter(item => item.completado).length;
  }

  get proximaTarea(): AgendaItem | null {
    const ahora = new Date();
    const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + 
                      ahora.getMinutes().toString().padStart(2, '0');
    
    const pendientes = this.agendaItems
      .filter(item => !item.completado && item.hora >= horaActual)
      .sort((a, b) => a.hora.localeCompare(b.hora));
    
    return pendientes.length > 0 ? pendientes[0] : null;
  }

  resetForm() {
    this.nuevoItem = {
      hora: '09:00',
      titulo: '',
      descripcion: '',
      categoria: 'trabajo',
      prioridad: 'media'
    };
  }

  getCurrentDate(): string {
  const today = new Date();
  return today.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

  getColorCategoria(categoria: string): string {
    const colores: { [key: string]: string } = {
      'trabajo': '#2563eb',
      'estudio': '#7c3aed',
      'salud': '#059669',
      'rutina': '#d97706',
      'ocio': '#dc2626',
      'compras': '#ea580c',
      'todas': '#64748b'
    };
    return colores[categoria] || '#64748b';
  }

  getColorPrioridad(prioridad: string): string {
    const colores: { [key: string]: string } = {
      'alta': '#dc2626',
      'media': '#d97706',
      'baja': '#059669'
    };
    return colores[prioridad] || '#64748b';
  }

  getIconoPrioridad(prioridad: string): any {
    const iconos: { [key: string]: any } = {
      'alta': this.Flame,
      'media': this.Zap,
      'baja': this.Droplet
    };
    return iconos[prioridad] || this.Clock;
  }

  getIconoCategoria(categoria: string): any {
    const iconos: { [key: string]: any } = {
      'trabajo': this.Briefcase,
      'estudio': this.BookOpen,
      'salud': this.Heart,
      'rutina': this.Coffee,
      'ocio': this.Play,
      'compras': this.ShoppingBag
    };
    return iconos[categoria] || this.Calendar;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  closeToast() {
    this.toastMessage = null;
  }

  abrirModal(item?: AgendaItem) {
    this.mostrarModal = true;
    if (item) {
      this.itemEditando = item;
      this.nuevoItem = {
        hora: item.hora,
        titulo: item.titulo,
        descripcion: item.descripcion,
        categoria: item.categoria,
        prioridad: item.prioridad
      };
    } else {
      this.itemEditando = null;
      this.resetForm();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.itemEditando = null;
    this.resetForm();
  }

  guardarActividad() {
    if (!this.nuevoItem.titulo.trim() || !this.nuevoItem.hora.trim()) {
      this.showToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    if (this.itemEditando) {
      // Actualizar actividad existente
      this.agendaService.update(this.itemEditando.id, this.nuevoItem).subscribe({
        next: (item) => {
          const index = this.agendaItems.findIndex(i => i.id === this.itemEditando!.id);
          if (index !== -1) {
            this.agendaItems[index] = item;
          }
          this.showToast('Actividad actualizada correctamente', 'success');
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar actividad:', err);
          this.showToast('No se pudo actualizar la actividad', 'error');
        }
      });
    } else {
      // Crear nueva actividad
      this.agregarItem();
      this.cerrarModal();
    }
  }
}