import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AgendaItem {
  id: number;
  hora: string;
  titulo: string;
  descripcion: string;
  completado: boolean;
  categoria: string;
  prioridad: 'alta' | 'media' | 'baja';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '📅 Mi Agenda Diaria';
  agendaItems: AgendaItem[] = [
    { 
      id: 1, 
      hora: '07:00', 
      titulo: 'Desayuno y planificación del día', 
      descripcion: 'Preparar desayuno saludable y revisar agenda',
      completado: true, 
      categoria: 'rutina', 
      prioridad: 'alta' 
    },
    { 
      id: 2, 
      hora: '09:00', 
      titulo: 'Reunión de equipo', 
      descripcion: 'Presentación del proyecto nuevo',
      completado: false, 
      categoria: 'trabajo', 
      prioridad: 'alta' 
    },
    { 
      id: 4, 
      hora: '13:00', 
      titulo: 'Almuerzo y descanso', 
      descripcion: 'Comida saludable y caminata corta',
      completado: false, 
      categoria: 'salud', 
      prioridad: 'media' 
    },
    { 
      id: 6, 
      hora: '18:00', 
      titulo: 'Gimnasio', 
      descripcion: 'Entrenamiento de fuerza 45min',
      completado: false, 
      categoria: 'salud', 
      prioridad: 'alta' 
    },
    { 
      id: 7, 
      hora: '20:00', 
      titulo: 'Tiempo libre', 
      descripcion: 'Leer libro o ver película',
      completado: false, 
      categoria: 'ocio', 
      prioridad: 'baja' 
    }
  ];

  nuevoItem = {
    hora: '09:00',
    titulo: '',
    descripcion: '',
    categoria: 'trabajo',
    prioridad: 'media' as 'alta' | 'media' | 'baja'
  };

  categorias = ['trabajo', 'estudio', 'salud', 'rutina', 'ocio', 'compras'];
  filtroCategoria: string = 'todas';

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
      const nuevoItem: AgendaItem = {
        id: Date.now(),
        hora: this.nuevoItem.hora,
        titulo: this.nuevoItem.titulo,
        descripcion: this.nuevoItem.descripcion,
        completado: false,
        categoria: this.nuevoItem.categoria,
        prioridad: this.nuevoItem.prioridad
      };
      this.agendaItems.unshift(nuevoItem);
      this.resetForm();
    }
  }

  eliminarItem(id: number) {
    this.agendaItems = this.agendaItems.filter(item => item.id !== id);
  }

  toggleCompletado(id: number) {
    const item = this.agendaItems.find(i => i.id === id);
    if (item) {
      item.completado = !item.completado;
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
      'trabajo': '#3b82f6',
      'estudio': '#8b5cf6',
      'salud': '#10b981',
      'rutina': '#f59e0b',
      'ocio': '#ef4444',
      'compras': '#f97316',
      'todas': '#6b7280'
    };
    return colores[categoria] || '#6b7280';
  }

  getColorPrioridad(prioridad: string): string {
    const colores: { [key: string]: string } = {
      'alta': '#ef4444',
      'media': '#f59e0b',
      'baja': '#10b981'
    };
    return colores[prioridad] || '#6b7280';
  }

  getIconoPrioridad(prioridad: string): string {
    const iconos: { [key: string]: string } = {
      'alta': '🔥',
      'media': '⚡',
      'baja': '💧'
    };
    return iconos[prioridad] || '📌';
  }
}