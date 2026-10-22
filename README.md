# VISARi - Visualización Interactiva del Rendimiento Académico 🎓✨

Prototipo web funcional e interactivo de **VISARi**, un SaaS educativo de alto impacto inspirado en el diseño minimalista y ágil de **Notion**, **Linear** y la gamificación motivacional de **Duolingo**.

---

## 🎨 1. Identidad Visual y Estética
- **Logo Oficial**: Integrado en la cabecera del sidebar (`logo-visari.png`) con escala optimizada y ajuste responsivo (`max-width: 160px; height: auto;`).
- **Paleta de Colores**:
  - **Azul Marino Profundo**: `#0F172A` / `#121936` (Dominante en header, sidebar y tarjetas principales).
  - **Violeta Suave**: `#8B5CF6` / `#A78BFA` (Color de acento, progreso, anillos de pulso y botones de acción).
  - **Fondo Claro Minimalista**: `#F8FAFC` con bordes sutiles de alta definición.
- **Tipografía**: `Inter` y `Plus Jakarta Sans`.
- **Micro-interacciones**: Anillo pulsante en el **Botón B**, animaciones de avance en barras de progreso y ráfagas de confeti con `canvas-confetti`.

---

## 🚀 2. Pantallas y Módulos Implementados

### 1. Landing & Autenticación (Login / Registro)
- Hero banner con propuesta de valor inspirada en SaaS modernos.
- Formulario de inicio de sesión / registro.
- Botón destacado de **"Continuar con Google"**.
- Acceso directo a Demo sin fricción.

### 2. Configuración de Perfil de Usuario con Sincronización en Vivo
- **Selector de Avatares Predeterminados**: 6 opciones ilustradas de alta calidad con indicador visual de selección.
- **Campo de Texto (URL de Imagen)**: Permite pegar cualquier enlace web de imagen y ver el cambio en tiempo real.
- **Subida de Archivo desde la PC (`<input type="file" accept="image/*">`)**: Procesa la foto local mediante `FileReader` en formato **Base64**.
- **Sincronización Dinámica Instantánea**: El avatar se actualiza al instante en:
  - La vista previa del perfil.
  - La **esquina superior derecha** (Header).
  - La barra lateral (Sidebar).
- Campos editables: Nombre, País, Universidad, Carrera y Celular/WhatsApp.
- Al hacer clic en **"Guardar Cambios"**, la información se persiste en el estado global (`localStorage`).

### 3. Dashboard General (Pantalla Principal)
- Métricas panorámicas clave en la parte superior:
  - **Promedio General (GPA)**: Cálculo reactivo ponderado.
  - **Horas Totales de Estudio**: Acumuladas reactivamente con el Botón B y materias.
  - **Avance Global**: Porcentaje de actividades completadas con barra animada.
  - **Próximos Exámenes**: Cuenta regresiva de parciales y finales.
- **4 Segmentos Fundamentales destacados**:
  - **a) Módulo Materias**: Vista rápida de avance y acceso directo.
  - **b) Módulo Cronómetro ("Botón B")**: Estado en vivo e inicio rápido de sesión de estudio.
  - **c) Módulo Calendario**: Próximos 3 hitos críticos ordenados cronológicamente.
  - **d) Módulo Trabajo en Equipo**: Indicador del sprint grupal y miembros activos.

### 4. Módulo Materias (Gestión Profunda y Reactiva)
- Cuadrícula de materias cursadas con horas acumuladas y avance individual.
- Modal para **"Agregar Nueva Materia"** (Nombre, código, docente, créditos).
- **Vista en Detalle (Drill-Down)**:
  - Tareas, entregas de trabajos prácticos, foros de debate, exámenes parciales y finales.
  - **Nueva opción: 📖 Lectura Diaria**: Permite registrar actividades dedicadas a lecturas de autores/capítulos específicos (ej. *"Lectura: Clean Code - Robert C. Martin"*), reflejando distintivamente que la actividad realizada es una lectura.
  - Checkbox reactivo: al marcar cualquier actividad, se recalcula instantáneamente la barra de la materia y **el progreso global en el Dashboard General**.

### 5. Módulo Cronómetro ("Botón B")
- Botón de acción rápida en el Navbar y pantalla completa de enfoque.
- Cronómetro digital en tiempo real con efecto visual de pulso violeta.
- Al presionar **"Detener & Asignar"**, despliega el modal interactivo:
  - *¿A qué materia deseas asignar este tiempo de estudio?*
  - Selector desplegable de materias activas y campo opcional para notas de repaso.
  - Al confirmar, suma automáticamente los minutos/horas a la materia elegida y actualiza todas las métricas globales.

### 6. Módulo Calendario
- Vista interactiva de calendario mensual con navegación entre meses.
- Días con marcadores y etiquetas diferenciadas para parciales (ámbar), finales (rosa), entregas (violeta) y **lecturas diarias** (verde azulado).
- Panel de agenda lateral con los próximos vencimientos consolidados automáticamente desde las materias.

### 7. Módulo Trabajo en Equipo
- Tablero colaborativo tipo **Kanban** (*Por Hacer*, *En Curso*, *Completado*).
- Asignación de tareas a compañeros de equipo con avatares individuales y prioridades (Alta, Media, Baja).
- Indicador de avance del sprint del equipo en tiempo real.

### 8. Botón Flotante "🪄 Cargar Datos Demo"
- Botón flotante accesible desde cualquier pantalla.
- Rellena instantáneamente la aplicación con 4 asignaturas completas, entregas, lecturas diarias, horas de estudio y miembros de equipo para demostraciones en vivo.
- Lanza animación de confeti festivo.

---

## 💻 3. Cómo Ejecutar el Prototipo

El prototipo está desarrollado con estándares web modernos (**HTML5, Tailwind CSS, Vanilla JS y LocalStorage**), sin necesidad de compilación o instalación previa de dependencias.

1. Abre el archivo directamente en cualquier navegador:
   ```
   C:\Users\Usuario\.gemini\antigravity\scratch\visari-app\index.html
   ```
2. O levanta un servidor estático local si lo prefieres:
   ```bash
   cd C:\Users\Usuario\.gemini\antigravity\scratch\visari-app
   npx serve .
   # o
   python -m http.server 3000
   ```
