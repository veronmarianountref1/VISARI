import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// Configuración oficial de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDqsrygmoi3sZIEEcCn55Kem-H5EsK-4MY",
  authDomain: "visari-ae148.firebaseapp.com",
  projectId: "visari-ae148",
  storageBucket: "visari-ae148.firebasestorage.app",
  messagingSenderId: "786255189281",
  appId: "1:786255189281:web:517eb509c0cf324fbc1a60",
  measurementId: "G-CGXW6Z2WWN"
};

// Inicializar Firebase, Firestore y Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

console.log("¡VISARi conectado a Firebase & Auth con éxito!");

/**
 * VISARi - Visualización Interactiva del Rendimiento Académico
 * Core State & Reactivity Engine
 */

// Initial Seed Data for Instant Realistic Presentation
const DEMO_DATA = {
  user: {
    uid: null,
    name: "Estudiante",
    email: "",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    country: "Argentina",
    university: "UNTREF VIRTUAL",
    career: "Licenciatura en Producción Audiovisual",
    phone: "",
    isAuthenticated: false
  },
  subjects: [
    {
      id: "sub-1",
      code: "01",
      name: "MEDIAMORFOSIS",
      color: "from-blue-600 to-indigo-700",
      accent: "#3B82F6",
      professor: "Lucas Stinziano",
      credits: 1,
      targetGrade: 9.0,
      studyMinutes: 1140, // 19h
      tasks: [
        { id: "t-101", title: "Implementación de Árboles AVL y Grafos", type: "entrega", dueDate: "2026-10-24", weight: 20, completed: true, grade: 9.5 },
        { id: "t-107", title: "Lectura: 'Introduction to Algorithms' (Cap. 4: Divide y Vencerás) - Cormen", type: "lectura", dueDate: "2026-10-25", weight: 10, completed: true, grade: null },
        { id: "t-102", title: "Participación Foro: Optimización Dijkstra vs A*", type: "foro", dueDate: "2026-10-26", weight: 10, completed: true, grade: 10 },
        { id: "t-103", title: "Guía de Ejercicios N° 4 - Complejidad Big-O", type: "tarea", dueDate: "2026-10-29", weight: 10, completed: true, grade: 9.0 },
        { id: "t-104", title: "Primer Examen Parcial Teórico-Práctico", type: "parcial", dueDate: "2026-11-04", weight: 30, completed: false, grade: null },
        { id: "t-105", title: "Entrega Trabajo Práctico Especial: Pathfinding", type: "entrega", dueDate: "2026-11-18", weight: 20, completed: false, grade: null },
        { id: "t-106", title: "Examen Final Integrador", type: "final", dueDate: "2026-12-10", weight: 35, completed: false, grade: null }
      ]
    },
    {
      id: "sub-2",
      code: "02",
      name: "DISEÑO Y DESARROLLO DE PLATAFORMA",
      color: "from-violet-600 to-purple-800",
      accent: "#8B5CF6",
      professor: "Fernando Moura",
      credits: 1,
      targetGrade: 9.5,
      studyMinutes: 870, // 14h 30m
      tasks: [
        { id: "t-201", title: "Benchmark heurístico y User Personas", type: "tarea", dueDate: "2026-10-22", weight: 15, completed: true, grade: 10 },
        { id: "t-202", title: "Design System Tokens en Figma", type: "entrega", dueDate: "2026-10-28", weight: 25, completed: true, grade: 9.8 },
        { id: "t-203", title: "Foro de Debate: Accesibilidad WCAG 2.2 AAA", type: "foro", dueDate: "2026-11-02", weight: 10, completed: true, grade: 9.5 },
        { id: "t-204", title: "Test de Usabilidad y Prototipo Interactivo", type: "entrega", dueDate: "2026-11-12", weight: 30, completed: false, grade: null },
        { id: "t-205", title: "Presentación Pitch Proyecto Final", type: "parcial", dueDate: "2026-11-26", weight: 20, completed: false, grade: null }
      ]
    },
    {
      id: "sub-3",
      code: "03",
      name: "LABORATORIO DE FORMULACIÓN DE PROYECTO II",
      color: "from-emerald-600 to-teal-800",
      accent: "#10B981",
      professor: "Segura Natalia",
      credits: 1,
      targetGrade: 8.5,
      studyMinutes: 630, // 10h 30m
      tasks: [
        { id: "t-301", title: "Normalización 3FN y Modelo Entidad-Relación", type: "tarea", dueDate: "2026-10-23", weight: 15, completed: true, grade: 8.5 },
        { id: "t-302", title: "Queries complejas SQL & Índices B-Tree", type: "tarea", dueDate: "2026-10-31", weight: 20, completed: false, grade: null },
        { id: "t-303", title: "Foro: Sharding vs Replicación en MongoDB", type: "foro", dueDate: "2026-11-06", weight: 10, completed: false, grade: null },
        { id: "t-304", title: "Examen Parcial de SQL y Arquitectura", type: "parcial", dueDate: "2026-11-15", weight: 35, completed: false, grade: null },
        { id: "t-305", title: "Modelado Documental MongoDB & Redis Cache", type: "entrega", dueDate: "2026-11-30", weight: 20, completed: false, grade: null }
      ]
    },
    {
      id: "sub-4",
      code: "04",
      name: "REALIZACIÓN AUDIOVISUAL",
      color: "from-amber-500 to-orange-700",
      accent: "#F59E0B",
      professor: "Obregón Marcelo",
      credits: 1,
      targetGrade: 8.0,
      studyMinutes: 480, // 8h
      tasks: [
        { id: "t-401", title: "Demostración por Inducción Matemática", type: "tarea", dueDate: "2026-10-21", weight: 15, completed: true, grade: 8.0 },
        { id: "t-402", title: "Relaciones de Recurrencia y Combinatoria", type: "tarea", dueDate: "2026-10-30", weight: 15, completed: true, grade: 8.5 },
        { id: "t-403", title: "Foro de Resolución de Paradojas Lógicas", type: "foro", dueDate: "2026-11-03", weight: 10, completed: false, grade: null },
        { id: "t-404", title: "Segundo Parcial: Teoría de Grafos y Autómatas", type: "parcial", dueDate: "2026-11-10", weight: 35, completed: false, grade: null },
        { id: "t-405", title: "Examen Final Regular", type: "final", dueDate: "2026-12-15", weight: 35, completed: false, grade: null }
      ]
    },
    {
      id: "sub-5",
      code: "05",
      name: "TRAYECTO FORMATIVO ALTERNATIVO I",
      color: "from-amber-500 to-orange-700",
      accent: "#F59E0B",
      professor: "Bertolotti Julio",
      credits: 1,
      targetGrade: 8.0,
      studyMinutes: 480, // 8h
      tasks: [
        { id: "t-401", title: "Demostración por Inducción Matemática", type: "tarea", dueDate: "2026-10-21", weight: 15, completed: true, grade: 8.0 },
        { id: "t-402", title: "Relaciones de Recurrencia y Combinatoria", type: "tarea", dueDate: "2026-10-30", weight: 15, completed: true, grade: 8.5 },
        { id: "t-403", title: "Foro de Resolución de Paradojas Lógicas", type: "foro", dueDate: "2026-11-03", weight: 10, completed: false, grade: null },
        { id: "t-404", title: "Segundo Parcial: Teoría de Grafos y Autómatas", type: "parcial", dueDate: "2026-11-10", weight: 35, completed: false, grade: null },
        { id: "t-405", title: "Examen Final Regular", type: "final", dueDate: "2026-12-15", weight: 35, completed: false, grade: null }
      ]
    }],
  team: {
    projectName: "Plataforma EduTech VISARi - MVP Colaborativo",
    subjectId: "sub-2",
    members: [
      { id: "m-1", name: "Sofía Albarracín (Tú)", role: "Tech Lead & Full-Stack", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", isUser: true },
      { id: "m-2", name: "Lucas Benítez", role: "Frontend & UI Design", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", isUser: false },
      { id: "m-3", name: "Valentina Morales", role: "Backend & Data Architect", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", isUser: false },
      { id: "m-4", name: "Martín Rivas", role: "QA & User Testing", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", isUser: false }
    ],
    tasks: [
      { id: "tt-1", title: "Definir paleta accesible y guía de estilos UI", assigneeId: "m-2", status: "done", priority: "alta", dueDate: "2026-10-22" },
      { id: "tt-2", title: "Arquitectura del Store reactivo en LocalStorage", assigneeId: "m-1", status: "done", priority: "alta", dueDate: "2026-10-24" },
      { id: "tt-3", title: "Conexión de endpoints de autenticación y Google SSO", assigneeId: "m-3", status: "in_progress", priority: "alta", dueDate: "2026-10-27" },
      { id: "tt-4", title: "Casos de prueba para el Botón B y cronómetro de estudio", assigneeId: "m-4", status: "in_progress", priority: "media", dueDate: "2026-10-29" },
      { id: "tt-5", title: "Testing de carga y sincronización de calendario", assigneeId: "m-1", status: "todo", priority: "media", dueDate: "2026-11-03" },
      { id: "tt-6", title: "Elaborar diapositivas para la defensa final del proyecto", assigneeId: "m-2", status: "todo", priority: "baja", dueDate: "2026-11-15" }
    ]
  }
};

/**
 * Reactive Application Store
 */
class VisariStore {
  constructor() {
    this.storageKey = 'visari_state_v1';
    this.listeners = [];
    this.state = this.loadState();

    // Timer state (in-memory for active sessions)
    this.timer = {
      seconds: 0,
      isRunning: false,
      intervalId: null,
      selectedSubjectId: null,
      mode: 'stopwatch' // 'stopwatch' | 'pomodoro'
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.user) parsed.user = { name: '', subjects: [], stats: { promedio: 0, horas: 0 } };
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(DEMO_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error("Could not save to localStorage:", e);
    }
    this.notify();
  }

  resetToDemo() {
    const prevAuth = this.state.user && this.state.user.isAuthenticated;
    const prevUser = this.state.user;
    this.state = JSON.parse(JSON.stringify(DEMO_DATA));
    if (prevAuth && prevUser && prevUser.uid) {
      // Preserve the authenticated Firebase user profile
      this.state.user = { ...prevUser };
    } else {
      // Demo guest mode
      this.state.user.name = "Veron Mariano (Demo)";
      this.state.user.email = "veronmarianountref1@gmail.com";
      this.state.user.avatar = "RETRATO MARIANO.png";
      this.state.user.isAuthenticated = true;
    }
    this.saveState();
    this.showToast("🪄 ¡Datos demo cargados con éxito! 4 materias, tareas y horas listas para explorar.");
    this.triggerConfetti();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Listener error:", err);
      }
    }
  }

  // --- Calculations Engine ---
  getSubjectProgress(subject) {
    if (!subject.tasks || subject.tasks.length === 0) return 0;
    const completed = subject.tasks.filter(t => t.completed).length;
    return Math.round((completed / subject.tasks.length) * 100);
  }

  getGlobalMetrics() {
    const subjects = this.state.subjects || [];
    let totalTasks = 0;
    let completedTasks = 0;
    let totalMinutes = 0;
    let gradedSum = 0;
    let gradedCount = 0;
    const upcomingExams = [];

    const todayStr = new Date().toISOString().split('T')[0];

    subjects.forEach(sub => {
      totalMinutes += (sub.studyMinutes || 0);
      (sub.tasks || []).forEach(task => {
        totalTasks++;
        if (task.completed) {
          completedTasks++;
          if (task.grade !== null && task.grade !== undefined) {
            gradedSum += task.grade;
            gradedCount++;
          }
        } else {
          if (task.type === 'parcial' || task.type === 'final') {
            upcomingExams.push({
              ...task,
              subjectName: sub.name,
              subjectCode: sub.code,
              subjectColor: sub.accent || '#8B5CF6'
            });
          }
        }
      });
    });

    // Sort upcoming exams chronologically
    upcomingExams.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const globalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const gpa = gradedCount > 0 ? (gradedSum / gradedCount).toFixed(1) : "8.8";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;

    return {
      globalProgress,
      totalTasks,
      completedTasks,
      totalMinutes,
      formattedHours,
      gpa,
      upcomingExams,
      subjectsCount: subjects.length
    };
  }

  // --- User Profile Actions ---
  updateUser(userData) {
    this.state.user = { ...this.state.user, ...userData };
    this.saveState();
    this.showToast("Perfil actualizado correctamente");
  }

  // --- Subjects Actions ---
  addSubject(subjectData) {
    const newSubject = {
      id: 'sub-' + Date.now(),
      code: subjectData.code || 'MAT-101',
      name: subjectData.name || 'Nueva Asignatura',
      color: subjectData.color || 'from-violet-600 to-indigo-800',
      accent: subjectData.accent || '#8B5CF6',
      professor: subjectData.professor || 'Profesor Titular',
      credits: Number(subjectData.credits) || 4,
      targetGrade: Number(subjectData.targetGrade) || 8.0,
      studyMinutes: 0,
      tasks: []
    };
    this.state.subjects.push(newSubject);
    this.saveState();
    this.showToast(`Materia "${newSubject.name}" agregada con éxito`);
  }

  deleteSubject(subjectId) {
    this.state.subjects = this.state.subjects.filter(s => s.id !== subjectId);
    this.saveState();
    this.showToast("Materia eliminada");
  }

  toggleTask(subjectId, taskId) {
    const subject = this.state.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const task = subject.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;

    // Check if whole subject reached 100%
    const progress = this.getSubjectProgress(subject);
    if (task.completed && progress === 100) {
      this.triggerConfetti();
      this.showToast(`🎉 ¡Felicitaciones! Has completado el 100% de actividades en ${subject.name}`);
    } else if (task.completed) {
      this.showToast(`Actividad marcada como completada: ${task.title}`);
    }

    this.saveState();
  }

  addTask(subjectId, taskData) {
    const subject = this.state.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const newTask = {
      id: 't-' + Date.now(),
      title: taskData.title || 'Nueva actividad',
      type: taskData.type || 'tarea',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      weight: Number(taskData.weight) || 10,
      completed: false,
      grade: null
    };

    subject.tasks.push(newTask);
    this.saveState();
    this.showToast("Actividad agregada a " + subject.name);
  }

  deleteTask(subjectId, taskId) {
    const subject = this.state.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    subject.tasks = subject.tasks.filter(t => t.id !== taskId);
    this.saveState();
    this.showToast("Actividad eliminada");
  }

  addStudyTime(subjectId, minutes) {
    const subject = this.state.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    subject.studyMinutes = (subject.studyMinutes || 0) + minutes;
    this.saveState();
    this.showToast(`⏱️ Se registraron +${minutes} minutos de estudio en ${subject.name}`);
  }

  // --- Team Actions ---
  addTeamTask(taskData) {
    const newTask = {
      id: 'tt-' + Date.now(),
      title: taskData.title,
      assigneeId: taskData.assigneeId,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'media',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
    };
    this.state.team.tasks.push(newTask);
    this.saveState();
    this.showToast("Tarea asignada al equipo");
  }

  updateTeamTaskStatus(taskId, newStatus) {
    const task = this.state.team.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.saveState();
      if (newStatus === 'done') {
        this.triggerConfetti();
        this.showToast(`🎉 Tarea del equipo completada: "${task.title}"`);
      }
    }
  }

  // --- UI Toast & Confetti Helpers ---
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'flex items-center gap-3 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-2xl border border-violet-500/30 transform transition-all duration-300 translate-y-2 opacity-0';
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
      <span class="flex-1">${message}</span>
      <button class="text-slate-400 hover:text-white" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#8B5CF6', '#A78BFA', '#3B82F6', '#10B981', '#F59E0B']
      });
    }
  }
}

// Global Store Instance
window.appStore = new VisariStore();

/**
 * VISARi UI Router & View Controller
 */
class VisariApp {
  constructor() {
    this.store = window.appStore;
    this.currentView = 'landing'; // Starts on landing until onAuthStateChanged validates session
    this.authMode = 'login'; // 'login' | 'register'
    this.selectedSubjectDetail = null;
    this.currentCalendarDate = new Date();
    this.timerTicker = null;

    this.init();
  }

  init() {
    // Subscribe to store updates
    this.store.subscribe(() => {
      this.render();
    });

    this.setupGlobalEvents();
    this.setupFirebaseAuth();
    this.render();
  }

  setupGlobalEvents() {
    // Top Bar Botón B quick-trigger
    const topBarBtnB = document.getElementById('topbar-btn-b');
    if (topBarBtnB) {
      topBarBtnB.addEventListener('click', () => {
        this.navigateTo('timer');
      });
    }

    // Demo Data Floating Button
    const demoBtn = document.getElementById('floating-demo-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        this.store.resetToDemo();
      });
    }
  }

  // ==========================================
  // FIREBASE AUTHENTICATION & STATE ENGINE
  // ==========================================
  setupFirebaseAuth() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase Auth State Changed: User Active", firebaseUser.email);
        await this.handleUserAuthenticated(firebaseUser);
      } else {
        console.log("Firebase Auth State Changed: No User Active");
        this.handleUserSignedOut();
      }
    });
  }

  async handleUserAuthenticated(firebaseUser) {
    let profileData = null;

    // Load or initialize user profile in Firestore
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        profileData = userSnap.data();
      } else {
        profileData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : "Estudiante"),
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'Estudiante')}&background=7c3aed&color=fff`,
          country: this.store.state.user.country || "Argentina",
          university: this.store.state.user.university || "UNTREF VIRTUAL",
          career: this.store.state.user.career || "Licenciatura en Producción Audiovisual",
          phone: this.store.state.user.phone || "",
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profileData, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore access info (falling back to Auth profile):", err);
    }

    const realName = (profileData && profileData.name) || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : "Estudiante");
    const realEmail = firebaseUser.email || (profileData && profileData.email) || "";
    const realAvatar = (profileData && profileData.avatar) || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=7c3aed&color=fff`;

    this.store.state.user = {
      ...this.store.state.user,
      ...(profileData || {}),
      uid: firebaseUser.uid,
      name: realName,
      email: realEmail,
      avatar: realAvatar,
      isAuthenticated: true
    };
    this.store.saveState();

    if (this.currentView === 'landing') {
      this.currentView = 'dashboard';
    }
    this.render();
  }

  handleUserSignedOut() {
    this.store.state.user.isAuthenticated = false;
    this.store.state.user.uid = null;
    this.store.state.user.email = "";
    this.store.saveState();

    this.currentView = 'landing';
    this.render();
  }

  async loginWithGoogle() {
    this.setAuthLoading(true);
    this.hideAuthAlert();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      this.store.showToast(`✅ ¡Bienvenido/a, ${user.displayName || user.email}!`);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      this.showAuthError(this.mapAuthError(error.code));
    } finally {
      this.setAuthLoading(false);
    }
  }

  async loginWithEmail(email, password) {
    this.setAuthLoading(true);
    this.hideAuthAlert();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      this.store.showToast(`✅ ¡Bienvenido/a, ${user.displayName || user.email}!`);
    } catch (error) {
      console.error("Error al iniciar sesión con correo:", error);
      this.showAuthError(this.mapAuthError(error.code));
    } finally {
      this.setAuthLoading(false);
    }
  }

  async registerWithEmail(name, email, password) {
    this.setAuthLoading(true);
    this.hideAuthAlert();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const chosenName = name.trim() || email.split('@')[0];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(chosenName)}&background=7c3aed&color=fff`;

      try {
        await updateProfile(user, {
          displayName: chosenName,
          photoURL: avatarUrl
        });
      } catch (profErr) {
        console.warn("Could not set displayName on Auth user:", profErr);
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          name: chosenName,
          email: email,
          avatar: avatarUrl,
          country: "Argentina",
          university: "UNTREF VIRTUAL",
          career: "Licenciatura en Producción Audiovisual",
          phone: "",
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (storeErr) {
        console.warn("Firestore setDoc on registration:", storeErr);
      }

      this.store.showToast(`🎉 ¡Cuenta creada con éxito! Bienvenido/a a VISARi, ${chosenName}`);
    } catch (error) {
      console.error("Error al registrar cuenta:", error);
      this.showAuthError(this.mapAuthError(error.code));
    } finally {
      this.setAuthLoading(false);
    }
  }

  async logout() {
    try {
      await signOut(auth);
      this.store.state.user.isAuthenticated = false;
      this.store.state.user.uid = null;
      this.store.state.user.email = "";
      this.store.saveState();
      this.navigateTo('landing');
      this.store.showToast("👋 Has cerrado sesión correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      this.store.showToast("Error al cerrar sesión: " + error.message);
    }
  }

  mapAuthError(code) {
    switch (code) {
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido inhabilitada por el administrador.';
      case 'auth/user-not-found':
        return 'No existe ninguna cuenta registrada con este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta. Inténtalo de nuevo.';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Verifica tu correo y contraseña.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este correo. Cambia a "Iniciar Sesión".';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      case 'auth/popup-closed-by-user':
        return 'Has cancelado o cerrado la ventana de inicio de Google.';
      case 'auth/popup-blocked':
        return 'El navegador bloqueó la ventana emergente de Google. Habilita las ventanas emergentes.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a Internet.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Por seguridad, espera unos momentos.';
      default:
        return 'Error de autenticación (' + (code || 'desconocido') + '). Intenta nuevamente.';
    }
  }

  setAuthMode(mode) {
    this.authMode = mode;
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const nameContainer = document.getElementById('auth-name-container');
    const title = document.getElementById('auth-card-title');
    const subtitle = document.getElementById('auth-card-subtitle');
    const submitText = document.getElementById('auth-submit-text');
    const pwdHint = document.getElementById('auth-pwd-hint');
    const toggleMsg = document.getElementById('auth-toggle-msg');
    const toggleBtn = document.getElementById('auth-toggle-btn');
    const pwdInput = document.getElementById('auth-password');
    const nameInput = document.getElementById('auth-name');

    this.hideAuthAlert();

    if (mode === 'register') {
      if (tabLogin) tabLogin.className = 'flex-1 py-2 text-xs font-semibold rounded-xl transition duration-200 text-slate-400 hover:text-white cursor-pointer';
      if (tabRegister) tabRegister.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md cursor-pointer';
      if (nameContainer) nameContainer.classList.remove('hidden');
      if (nameInput) nameInput.required = true;
      if (title) title.textContent = 'Crea tu Cuenta';
      if (subtitle) subtitle.textContent = 'Comienza a potenciar tu rendimiento académico hoy';
      if (submitText) submitText.textContent = 'Crear Cuenta en VISARi →';
      if (pwdHint) pwdHint.classList.remove('hidden');
      if (toggleMsg) toggleMsg.textContent = '¿Ya tienes una cuenta registrada?';
      if (toggleBtn) toggleBtn.textContent = 'Inicia sesión aquí';
      if (pwdInput) pwdInput.setAttribute('autocomplete', 'new-password');
    } else {
      if (tabLogin) tabLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md cursor-pointer';
      if (tabRegister) tabRegister.className = 'flex-1 py-2 text-xs font-semibold rounded-xl transition duration-200 text-slate-400 hover:text-white cursor-pointer';
      if (nameContainer) nameContainer.classList.add('hidden');
      if (nameInput) nameInput.required = false;
      if (title) title.textContent = 'Ingresa a tu Campus';
      if (subtitle) subtitle.textContent = 'Accede con tu cuenta institucional o Google Workspace';
      if (submitText) submitText.textContent = 'Ingresar al Dashboard →';
      if (pwdHint) pwdHint.classList.add('hidden');
      if (toggleMsg) toggleMsg.textContent = '¿No tienes una cuenta aún?';
      if (toggleBtn) toggleBtn.textContent = 'Regístrate aquí';
      if (pwdInput) pwdInput.setAttribute('autocomplete', 'current-password');
    }
  }

  showAuthError(message) {
    const alertBox = document.getElementById('auth-alert');
    const alertMsg = document.getElementById('auth-alert-message');
    const alertIcon = document.getElementById('auth-alert-icon');
    if (alertBox && alertMsg) {
      alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-medium border flex items-start gap-2.5 transition duration-200 bg-rose-500/15 border-rose-500/40 text-rose-300';
      if (alertIcon) alertIcon.textContent = '⚠️';
      alertMsg.textContent = message;
      alertBox.classList.remove('hidden');
    }
  }

  hideAuthAlert() {
    const alertBox = document.getElementById('auth-alert');
    if (alertBox) alertBox.classList.add('hidden');
  }

  setAuthLoading(isLoading) {
    const submitBtn = document.getElementById('auth-submit-btn');
    const googleBtn = document.getElementById('btn-google-auth');
    const spinner = document.getElementById('auth-submit-spinner');
    if (submitBtn) submitBtn.disabled = isLoading;
    if (googleBtn) googleBtn.disabled = isLoading;
    if (spinner) {
      if (isLoading) spinner.classList.remove('hidden');
      else spinner.classList.add('hidden');
    }
  }

  navigateTo(view, payload = null) {
    if (!this.store.state.user.isAuthenticated && view !== 'landing') {
      this.currentView = 'landing';
      this.render();
      return;
    }
    this.currentView = view;
    if (view === 'materia-detail' && payload) {
      this.selectedSubjectDetail = payload;
    }
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const state = this.store.state;

    // Check auth view vs app view
    const landingView = document.getElementById('view-landing');
    const appShell = document.getElementById('app-shell');

    if (this.currentView === 'landing' || !state.user.isAuthenticated) {
      if (landingView) landingView.classList.remove('hidden');
      if (appShell) appShell.classList.add('hidden');
      this.renderLanding();
      return;
    } else {
      if (landingView) landingView.classList.add('hidden');
      if (appShell) appShell.classList.remove('hidden');
    }

    // Update global layout indicators (Sidebar active item, User Avatar, Timer badge)
    this.updateShell(state);

    // Hide all view panels
    const views = ['dashboard', 'materias', 'materia-detail', 'timer', 'calendar', 'team', 'profile'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === this.currentView) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    // Render specific view
    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboard(state);
        break;
      case 'materias':
        this.renderMaterias(state);
        break;
      case 'materia-detail':
        this.renderMateriaDetail(state);
        break;
      case 'timer':
        this.renderTimerView(state);
        break;
      case 'calendar':
        this.renderCalendar(state);
        break;
      case 'team':
        this.renderTeam(state);
        break;
      case 'profile':
        this.renderProfile(state);
        break;
    }

    // Reinitialize icons if lucide is loaded
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  updateShell(state) {
    // Update user info in header and sidebar
    const userNames = document.querySelectorAll('.user-display-name');
    userNames.forEach(el => el.textContent = state.user.name || 'Estudiante');

    const userCareers = document.querySelectorAll('.user-display-career');
    userCareers.forEach(el => el.textContent = state.user.career || 'Estudiante Universitario');

    const userAvatars = document.querySelectorAll('.user-display-avatar');
    userAvatars.forEach(el => {
      if (el.tagName === 'IMG') {
        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user.name || 'Estudiante')}&background=7c3aed&color=fff`;
        el.src = state.user.avatar || fallbackUrl;
        el.onerror = () => {
          el.src = fallbackUrl;
        };
      }
    });

    // Update Sidebar Navigation highlights
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const target = item.getAttribute('data-target');
      if (target === this.currentView || (this.currentView === 'materia-detail' && target === 'materias')) {
        item.classList.add('bg-violet-600/10', 'text-violet-600', 'font-semibold', 'border-l-4', 'border-violet-600');
        item.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        item.classList.remove('bg-violet-600/10', 'text-violet-600', 'font-semibold', 'border-l-4', 'border-violet-600');
        item.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    // Top Bar Timer Widget Status
    const timerStatus = document.getElementById('topbar-timer-status');
    const timerDisplay = document.getElementById('topbar-timer-display');
    if (timerStatus && timerDisplay) {
      if (this.store.timer.isRunning) {
        timerStatus.classList.remove('hidden');
        timerStatus.classList.add('flex');
        timerDisplay.textContent = this.formatSeconds(this.store.timer.seconds);
      } else {
        timerStatus.classList.add('hidden');
        timerStatus.classList.remove('flex');
      }
    }
  }

  // ==========================================
  // VIEW 1: LANDING & AUTH
  // ==========================================
  renderLanding() {
    const form = document.getElementById('auth-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('auth-email');
        const pwdInput = document.getElementById('auth-password');
        const nameInput = document.getElementById('auth-name');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = pwdInput ? pwdInput.value : '';
        const name = nameInput ? nameInput.value.trim() : '';

        if (!email || !password) {
          this.showAuthError('Por favor completa todos los campos requeridos.');
          return;
        }

        if (this.authMode === 'register') {
          await this.registerWithEmail(name, email, password);
        } else {
          await this.loginWithEmail(email, password);
        }
      };
    }

    const googleBtn = document.getElementById('btn-google-auth');
    if (googleBtn) {
      googleBtn.onclick = () => {
        this.loginWithGoogle();
      };
    }

    const tabLogin = document.getElementById('auth-tab-login');
    if (tabLogin) {
      tabLogin.onclick = () => this.setAuthMode('login');
    }

    const tabRegister = document.getElementById('auth-tab-register');
    if (tabRegister) {
      tabRegister.onclick = () => this.setAuthMode('register');
    }

    const toggleBtn = document.getElementById('auth-toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        this.setAuthMode(this.authMode === 'login' ? 'register' : 'login');
      };
    }

    const demoDirectBtn = document.getElementById('btn-direct-demo');
    if (demoDirectBtn) {
      demoDirectBtn.onclick = () => {
        this.store.resetToDemo();
        this.navigateTo('dashboard');
      };
    }
  }

  // ==========================================
  // VIEW 2: PROFILE
  // ==========================================
  renderProfile(state) {
    const user = state.user;
    const nameInput = document.getElementById('profile-name');
    const avatarInput = document.getElementById('profile-avatar');
    const countryInput = document.getElementById('profile-country');
    const uniInput = document.getElementById('profile-uni');
    const careerInput = document.getElementById('profile-career');
    const phoneInput = document.getElementById('profile-phone');
    const emailDisplay = document.getElementById('profile-email');

    if (nameInput) nameInput.value = user.name || '';
    if (avatarInput) avatarInput.value = user.avatar || '';
    if (countryInput) countryInput.value = user.country || '';
    if (uniInput) uniInput.value = user.university || '';
    if (careerInput) careerInput.value = user.career || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (emailDisplay) emailDisplay.textContent = user.email || 'Sin correo asociado';

    // Summary counters in profile
    const metrics = this.store.getGlobalMetrics();
    const countSubjects = document.getElementById('profile-stat-subjects');
    const countHours = document.getElementById('profile-stat-hours');
    const countGpa = document.getElementById('profile-stat-gpa');

    if (countSubjects) countSubjects.textContent = metrics.subjectsCount;
    if (countHours) countHours.textContent = metrics.formattedHours;
    if (countGpa) countGpa.textContent = metrics.gpa;

    // Helper: Dynamic real-time avatar sync across the entire app (Preview, Header Top-Right, Sidebar)
    const syncAvatars = (imageUrl) => {
      const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Estudiante')}&background=7c3aed&color=fff`;
      const targetUrl = imageUrl && imageUrl.trim() ? imageUrl.trim() : fallback;

      // Update preview in profile
      const previewImg = document.getElementById('profile-avatar-preview');
      if (previewImg) previewImg.src = targetUrl;

      // Update all avatar instances throughout the application
      const allAvatars = document.querySelectorAll('.user-display-avatar');
      allAvatars.forEach(img => {
        if (img.tagName === 'IMG') {
          img.src = targetUrl;
        }
      });
    };

    // Live update when typing or pasting URL
    if (avatarInput) {
      avatarInput.oninput = (e) => {
        const val = e.target.value.trim();
        syncAvatars(val);
        document.querySelectorAll('.avatar-preset-btn').forEach(btn => {
          if (btn.getAttribute('data-url') === val) {
            btn.classList.add('border-violet-600', 'ring-2', 'ring-violet-400');
            btn.classList.remove('border-transparent');
          } else {
            btn.classList.remove('border-violet-600', 'ring-2', 'ring-violet-400');
            btn.classList.add('border-transparent');
          }
        });
      };
    }

    // Direct PC File Upload using FileReader (Base64)
    const fileInput = document.getElementById('profile-avatar-file');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
          this.store.showToast("⚠️ La imagen seleccionada es mayor a 3MB. Se recomienda una imagen más ligera.");
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const base64Data = loadEvent.target.result;
          if (avatarInput) avatarInput.value = base64Data;
          syncAvatars(base64Data);

          const statusEl = document.getElementById('file-upload-status');
          if (statusEl) {
            statusEl.textContent = `✓ ${file.name.slice(0, 16)}...`;
            statusEl.classList.remove('text-slate-400');
            statusEl.classList.add('text-emerald-600', 'font-semibold');
          }

          document.querySelectorAll('.avatar-preset-btn').forEach(btn => {
            btn.classList.remove('border-violet-600', 'ring-2', 'ring-violet-400');
            btn.classList.add('border-transparent');
          });

          this.store.showToast("📷 Imagen procesada correctamente. Haz clic en 'Guardar Cambios' para conservarla.");
        };
        reader.readAsDataURL(file);
      };
    }

    // Avatar presets quick selection
    const avatarPresets = document.querySelectorAll('.avatar-preset-btn');
    avatarPresets.forEach(btn => {
      const url = btn.getAttribute('data-url');
      if (user.avatar === url) {
        btn.classList.add('border-violet-600', 'ring-2', 'ring-violet-400');
        btn.classList.remove('border-transparent');
      } else {
        btn.classList.remove('border-violet-600', 'ring-2', 'ring-violet-400');
        btn.classList.add('border-transparent');
      }

      btn.onclick = () => {
        if (avatarInput) avatarInput.value = url;
        syncAvatars(url);

        avatarPresets.forEach(b => {
          b.classList.remove('border-violet-600', 'ring-2', 'ring-violet-400');
          b.classList.add('border-transparent');
        });
        btn.classList.add('border-violet-600', 'ring-2', 'ring-violet-400');
        btn.classList.remove('border-transparent');

        const statusEl = document.getElementById('file-upload-status');
        if (statusEl) {
          statusEl.textContent = "Preset seleccionado";
          statusEl.classList.remove('text-emerald-600', 'font-semibold');
          statusEl.classList.add('text-slate-400');
        }
      };
    });

    // Form submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const newAvatar = avatarInput.value.trim() || user.avatar;
        const updatedData = {
          name: nameInput.value.trim(),
          avatar: newAvatar,
          country: countryInput.value.trim(),
          university: uniInput.value.trim(),
          career: careerInput.value.trim(),
          phone: phoneInput.value.trim()
        };
        this.store.updateUser(updatedData);

        // Sync with Firestore if active Firebase session
        if (auth.currentUser) {
          try {
            await setDoc(doc(db, "users", auth.currentUser.uid), updatedData, { merge: true });
          } catch (err) {
            console.warn("Firestore error updating profile:", err);
          }

          try {
            await updateProfile(auth.currentUser, {
              displayName: updatedData.name,
              photoURL: updatedData.avatar.startsWith('http') ? updatedData.avatar : null
            });
          } catch (err) {
            console.warn("Firebase Auth error updating profile:", err);
          }
        }
      };
    }
  }

  // ==========================================
  // VIEW 3: DASHBOARD GENERAL
  // ==========================================
  renderDashboard(state) {
    const metrics = this.store.getGlobalMetrics();

    // Top Metrics
    const gpaEl = document.getElementById('dash-gpa');
    const hoursEl = document.getElementById('dash-hours');
    const progressEl = document.getElementById('dash-progress');
    const progressFill = document.getElementById('dash-progress-bar');
    const examsCountEl = document.getElementById('dash-exams-count');

    if (gpaEl) gpaEl.textContent = metrics.gpa + " / 10";
    if (hoursEl) hoursEl.textContent = metrics.formattedHours;
    if (progressEl) progressEl.textContent = `${metrics.globalProgress}% (${metrics.completedTasks}/${metrics.totalTasks} tareas)`;
    if (progressFill) progressFill.style.width = `${metrics.globalProgress}%`;
    if (examsCountEl) {
      examsCountEl.textContent = metrics.upcomingExams.length > 0
        ? `${metrics.upcomingExams.length} programados`
        : "Sin exámenes próximos";
    }

    // 4 Main Segments Previews
    this.renderDashboardSegments(state, metrics);
  }

  renderDashboardSegments(state, metrics) {
    // 1. Materias Preview List
    const materiasContainer = document.getElementById('dash-segment-materias');
    if (materiasContainer) {
      if (state.subjects.length === 0) {
        materiasContainer.innerHTML = `<p class="text-sm text-slate-500 py-4">No hay materias registradas. ¡Agrega una para comenzar!</p>`;
      } else {
        materiasContainer.innerHTML = state.subjects.slice(0, 3).map(sub => {
          const prog = this.store.getSubjectProgress(sub);
          const completedCount = sub.tasks.filter(t => t.completed).length;
          return `
            <div class="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/60 cursor-pointer" onclick="window.visariApp.navigateTo('materia-detail', '${sub.id}')">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full" style="background-color: ${sub.accent || '#8B5CF6'}"></span>
                <div>
                  <h4 class="text-sm font-semibold text-slate-900">${sub.name}</h4>
                  <p class="text-xs text-slate-500">${sub.code} • ${completedCount}/${sub.tasks.length} actividades</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div class="h-full bg-violet-600 rounded-full transition-all duration-500" style="width: ${prog}%"></div>
                </div>
                <span class="text-xs font-bold text-slate-700 w-8 text-right">${prog}%</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 2. Cronómetro Botón B Widget
    const timerWidgetBtn = document.getElementById('dash-segment-timer-btn');
    const timerStatusLabel = document.getElementById('dash-timer-status-label');
    if (timerWidgetBtn && timerStatusLabel) {
      if (this.store.timer.isRunning) {
        timerStatusLabel.textContent = `En curso: ${this.formatSeconds(this.store.timer.seconds)}`;
        timerWidgetBtn.innerHTML = `
          <span class="flex items-center gap-2 text-rose-500 font-semibold">
            <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            Detener & Asignar
          </span>
        `;
        timerWidgetBtn.onclick = () => {
          this.navigateTo('timer');
          this.stopTimerPrompt();
        };
      } else {
        timerStatusLabel.textContent = "Listo para una nueva sesión";
        timerWidgetBtn.innerHTML = `
          <span class="flex items-center gap-2 text-violet-600 font-semibold">
            ⚡ Iniciar Cronómetro
          </span>
        `;
        timerWidgetBtn.onclick = () => {
          this.navigateTo('timer');
        };
      }
    }

    // 3. Calendario Preview (Next upcoming milestones)
    const calContainer = document.getElementById('dash-segment-calendar');
    if (calContainer) {
      if (metrics.upcomingExams.length === 0) {
        calContainer.innerHTML = `<p class="text-sm text-slate-500 py-3">No hay exámenes ni entregas urgentes próximas.</p>`;
      } else {
        calContainer.innerHTML = metrics.upcomingExams.slice(0, 3).map(exam => {
          const typeBadge = exam.type === 'parcial'
            ? '<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">PARCIAL</span>'
            : '<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">FINAL</span>';
          return `
            <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <div class="flex items-center gap-2.5">
                <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${exam.subjectColor}"></div>
                <div>
                  <p class="text-xs font-bold text-slate-800">${exam.title}</p>
                  <p class="text-[11px] text-slate-500">${exam.subjectName}</p>
                </div>
              </div>
              <div class="text-right flex items-center gap-2">
                ${typeBadge}
                <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  📅 ${exam.dueDate}
                </span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Team Preview
    const teamContainer = document.getElementById('dash-segment-team');
    if (teamContainer) {
      const activeTasks = state.team.tasks.filter(t => t.status !== 'done');
      const doneCount = state.team.tasks.filter(t => t.status === 'done').length;
      const teamProg = state.team.tasks.length > 0 ? Math.round((doneCount / state.team.tasks.length) * 100) : 0;

      teamContainer.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Progreso del sprint grupal</span>
            <span class="text-xs font-bold text-violet-600">${teamProg}% completado</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="h-full bg-violet-600 rounded-full transition-all duration-500" style="width: ${teamProg}%"></div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <div class="flex -space-x-2">
              ${state.team.members.map(m => `
                <img src="${m.avatar}" title="${m.name}" class="w-7 h-7 rounded-full border-2 border-white object-cover" />
              `).join('')}
            </div>
            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              ${activeTasks.length} tareas pendientes
            </span>
          </div>
        </div>
      `;
    }
  }

  // ==========================================
  // VIEW 4: MATERIAS (OVERVIEW & DETAIL)
  // ==========================================
  renderMaterias(state) {
    const grid = document.getElementById('materias-grid');
    if (!grid) return;

    if (state.subjects.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p class="text-slate-500 font-medium">No has registrado materias aún.</p>
          <button class="mt-4 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition" onclick="window.visariApp.openNewSubjectModal()">
            + Agregar tu primera materia
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = state.subjects.map(subject => {
      const progress = this.store.getSubjectProgress(subject);
      const totalTasks = subject.tasks.length;
      const completedTasks = subject.tasks.filter(t => t.completed).length;
      const hours = Math.floor(subject.studyMinutes / 60);
      const mins = subject.studyMinutes % 60;
      const studyTimeStr = `${hours}h ${mins > 0 ? mins + 'm' : ''}`;

      return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          <div>
            <div class="flex items-start justify-between mb-4">
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white bg-slate-900">
                ${subject.code}
              </span>
              <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>⏱️ ${studyTimeStr}</span>
              </div>
            </div>

            <h3 class="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1 mb-1">
              ${subject.name}
            </h3>
            <p class="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
              <span>👤 ${subject.professor}</span>
              <span>•</span>
              <span>${subject.credits} Créditos</span>
            </p>

            <!-- Progress bar -->
            <div class="space-y-1.5 mb-5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-slate-600">Avance de Cursada</span>
                <span class="text-violet-600 font-bold">${progress}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="h-full bg-violet-600 rounded-full transition-all duration-600" style="width: ${progress}%"></div>
              </div>
              <p class="text-[11px] text-slate-400 text-right">${completedTasks} de ${totalTasks} actividades completadas</p>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button class="px-3.5 py-1.5 bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5" onclick="window.visariApp.navigateTo('materia-detail', '${subject.id}')">
              <span>Ver Tareas & Entregas</span>
              <span>→</span>
            </button>
            <button class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition" title="Eliminar Materia" onclick="window.visariApp.confirmDeleteSubject('${subject.id}')">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderMateriaDetail(state) {
    const subject = state.subjects.find(s => s.id === this.selectedSubjectDetail);
    if (!subject) {
      this.navigateTo('materias');
      return;
    }

    const progress = this.store.getSubjectProgress(subject);
    const completedTasks = subject.tasks.filter(t => t.completed).length;
    const hours = Math.floor(subject.studyMinutes / 60);
    const mins = subject.studyMinutes % 60;

    // Header info
    document.getElementById('materia-detail-code').textContent = subject.code;
    document.getElementById('materia-detail-name').textContent = subject.name;
    document.getElementById('materia-detail-prof').textContent = `Profesor: ${subject.professor} • ${subject.credits} Créditos`;
    document.getElementById('materia-detail-hours').textContent = `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    document.getElementById('materia-detail-progress-num').textContent = `${progress}%`;
    document.getElementById('materia-detail-progress-bar').style.width = `${progress}%`;
    document.getElementById('materia-detail-ratio').textContent = `${completedTasks} de ${subject.tasks.length} actividades completadas`;

    // Tasks list
    const tasksContainer = document.getElementById('materia-detail-tasks');
    if (tasksContainer) {
      if (subject.tasks.length === 0) {
        tasksContainer.innerHTML = `<p class="text-sm text-slate-400 py-6 text-center">No hay actividades creadas para esta materia aún.</p>`;
      } else {
        tasksContainer.innerHTML = subject.tasks.map(task => {
          const typeLabels = {
            tarea: { text: "Tarea", cls: "bg-blue-50 text-blue-700 border-blue-200" },
            entrega: { text: "Entrega TP", cls: "bg-purple-50 text-purple-700 border-purple-200" },
            foro: { text: "Foro / Debate", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            lectura: { text: "📖 Lectura Diaria", cls: "bg-teal-50 text-teal-800 border-teal-300 font-bold" },
            parcial: { text: "Examen Parcial", cls: "bg-amber-50 text-amber-700 border-amber-200" },
            final: { text: "Examen Final", cls: "bg-rose-50 text-rose-700 border-rose-200" }
          };
          const badge = typeLabels[task.type] || typeLabels.tarea;

          return `
            <div class="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200/80 transition group ${task.completed ? 'opacity-70 bg-slate-50/50' : ''}">
              <div class="flex items-center gap-3.5">
                <input 
                  type="checkbox" 
                  ${task.completed ? 'checked' : ''} 
                  class="w-5 h-5 rounded-md text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer transition"
                  onchange="window.visariApp.store.toggleTask('${subject.id}', '${task.id}')"
                />
                <div>
                  <h4 class="text-sm font-semibold text-slate-900 ${task.completed ? 'line-through text-slate-500' : ''}">
                    ${task.title}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}">${badge.text}</span>
                    <span class="text-xs text-slate-400">📅 Límite: ${task.dueDate}</span>
                    ${task.grade ? `<span class="text-xs font-semibold text-emerald-600">Nota: ${task.grade}</span>` : ''}
                  </div>
                </div>
              </div>
              <button 
                class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 transition" 
                title="Eliminar actividad"
                onclick="window.visariApp.store.deleteTask('${subject.id}', '${task.id}')">
                ✕
              </button>
            </div>
          `;
        }).join('');
      }
    }
  }

  openNewSubjectModal() {
    const modal = document.getElementById('modal-new-subject');
    if (modal) modal.classList.remove('hidden');
  }

  closeNewSubjectModal() {
    const modal = document.getElementById('modal-new-subject');
    if (modal) modal.classList.add('hidden');
  }

  openNewTaskModal() {
    const modal = document.getElementById('modal-new-task');
    if (modal) modal.classList.remove('hidden');
  }

  closeNewTaskModal() {
    const modal = document.getElementById('modal-new-task');
    if (modal) modal.classList.add('hidden');
  }

  confirmDeleteSubject(subjectId) {
    if (confirm("¿Estás seguro de que deseas eliminar esta materia? Esta acción recalculará todo el avance del Dashboard.")) {
      this.store.deleteSubject(subjectId);
    }
  }

  // ==========================================
  // VIEW 5: CRONÓMETRO / "BOTÓN B"
  // ==========================================
  renderTimerView(state) {
    const timer = this.store.timer;
    const timeDisplay = document.getElementById('main-timer-display');
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const stopBtn = document.getElementById('timer-stop-btn');
    const timerCircle = document.getElementById('timer-container-circle');

    if (timeDisplay) timeDisplay.textContent = this.formatSeconds(timer.seconds);

    if (timerCircle) {
      if (timer.isRunning) {
        timerCircle.classList.add('timer-running-glow', 'border-violet-500');
        timerCircle.classList.remove('border-slate-200');
      } else {
        timerCircle.classList.remove('timer-running-glow', 'border-violet-500');
        timerCircle.classList.add('border-slate-200');
      }
    }

    if (startBtn && pauseBtn && stopBtn) {
      if (timer.isRunning) {
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        stopBtn.removeAttribute('disabled');
        stopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        if (timer.seconds === 0) {
          stopBtn.setAttribute('disabled', 'true');
          stopBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          stopBtn.removeAttribute('disabled');
          stopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      }
    }

    // Populate subject selector dropdown
    const subSelect = document.getElementById('timer-subject-select');
    if (subSelect) {
      subSelect.innerHTML = `<option value="">-- Elige una materia --</option>` + state.subjects.map(s => `
        <option value="${s.id}">${s.name} (${s.code})</option>
      `).join('');
    }
  }

  startTimer() {
    if (this.store.timer.isRunning) return;
    this.store.timer.isRunning = true;

    this.timerTicker = setInterval(() => {
      this.store.timer.seconds++;
      const timeDisplay = document.getElementById('main-timer-display');
      if (timeDisplay) timeDisplay.textContent = this.formatSeconds(this.store.timer.seconds);

      const topDisplay = document.getElementById('topbar-timer-display');
      if (topDisplay) topDisplay.textContent = this.formatSeconds(this.store.timer.seconds);
    }, 1000);

    this.render();
  }

  pauseTimer() {
    this.store.timer.isRunning = false;
    clearInterval(this.timerTicker);
    this.render();
  }

  resetTimer() {
    this.pauseTimer();
    this.store.timer.seconds = 0;
    this.render();
  }

  stopTimerPrompt() {
    this.pauseTimer();
    if (this.store.timer.seconds < 1) {
      this.store.showToast("Inicia el cronómetro antes de asignar tiempo.");
      return;
    }

    // Populate stop modal
    const modal = document.getElementById('modal-assign-study-time');
    const minsRecorded = Math.max(1, Math.round(this.store.timer.seconds / 60));
    const timeSummary = document.getElementById('assign-time-summary');
    if (timeSummary) {
      timeSummary.textContent = `${this.formatSeconds(this.store.timer.seconds)} (~${minsRecorded} min)`;
    }

    const selectEl = document.getElementById('assign-subject-select');
    if (selectEl) {
      selectEl.innerHTML = this.store.state.subjects.map(s => `
        <option value="${s.id}">${s.name} (${s.code})</option>
      `).join('');
    }

    if (modal) modal.classList.remove('hidden');
  }

  confirmAssignStudyTime() {
    const selectEl = document.getElementById('assign-subject-select');
    const subjectId = selectEl.value;
    const minsRecorded = Math.max(1, Math.round(this.store.timer.seconds / 60));

    if (!subjectId) {
      alert("Por favor selecciona una materia");
      return;
    }

    this.store.addStudyTime(subjectId, minsRecorded);
    this.store.triggerConfetti();

    // Reset timer
    this.store.timer.seconds = 0;
    this.store.timer.isRunning = false;

    // Close modal
    const modal = document.getElementById('modal-assign-study-time');
    if (modal) modal.classList.add('hidden');

    this.render();
  }

  formatSeconds(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ==========================================
  // VIEW 6: CALENDARIO
  // ==========================================
  renderCalendar(state) {
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthLabel = document.getElementById('calendar-month-label');
    if (monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;

    // Collect all events from subjects
    const allEvents = [];
    state.subjects.forEach(sub => {
      (sub.tasks || []).forEach(task => {
        allEvents.push({
          ...task,
          subjectName: sub.name,
          subjectCode: sub.code,
          subjectColor: sub.accent || '#8B5CF6'
        });
      });
    });

    // Calendar Grid Days
    const gridEl = document.getElementById('calendar-days-grid');
    if (!gridEl) return;

    gridEl.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust so Monday is 0
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty offset cells
    for (let i = 0; i < startOffset; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'h-24 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/50';
      gridEl.appendChild(emptyCell);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isToday = dateStr === todayStr;

      const dayEvents = allEvents.filter(e => e.dueDate === dateStr);

      const cell = document.createElement('div');
      cell.className = `h-28 p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${isToday
        ? 'bg-violet-50/60 border-violet-400 ring-2 ring-violet-400/20'
        : 'bg-white border-slate-200/80 hover:border-violet-300 hover:shadow-sm'
        }`;

      cell.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold ${isToday ? 'text-violet-700 bg-violet-200/70 w-5 h-5 flex items-center justify-center rounded-full' : 'text-slate-700'}">${day}</span>
          ${dayEvents.length > 0 ? `<span class="text-[10px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.2 rounded-full">${dayEvents.length}</span>` : ''}
        </div>
        <div class="space-y-1 overflow-hidden flex-1 mt-1">
          ${dayEvents.slice(0, 2).map(ev => {
        const isExam = ev.type === 'parcial' || ev.type === 'final';
        const isLectura = ev.type === 'lectura';
        const pillCls = isExam
          ? 'bg-amber-100 text-amber-900 font-semibold'
          : isLectura
            ? 'bg-teal-100 text-teal-900 font-semibold border border-teal-200'
            : 'bg-slate-100 text-slate-700';
        return `
              <div class="text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${pillCls}" title="${ev.title} (${ev.subjectCode})">
                ${isLectura ? '📖 ' : ''}${ev.title}
              </div>
            `;
      }).join('')}
          ${dayEvents.length > 2 ? `<div class="text-[9px] text-slate-400 font-medium">+${dayEvents.length - 2} más</div>` : ''}
        </div>
      `;

      cell.onclick = () => this.showCalendarDayEvents(dateStr, dayEvents);
      gridEl.appendChild(cell);
    }

    // Side list: upcoming 5 events
    const upcomingList = document.getElementById('calendar-upcoming-list');
    if (upcomingList) {
      const sortedEvents = [...allEvents].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      upcomingList.innerHTML = sortedEvents.slice(0, 5).map(ev => `
        <div class="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${ev.subjectColor}"></span>
            <div>
              <p class="text-xs font-bold text-slate-800 line-clamp-1">${ev.title}</p>
              <p class="text-[11px] text-slate-500">${ev.subjectName} • ${ev.type === 'lectura' ? '📖 LECTURA DIARIA' : ev.type.toUpperCase()}</p>
            </div>
          </div>
          <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
            ${ev.dueDate}
          </span>
        </div>
      `).join('');
    }
  }

  showCalendarDayEvents(dateStr, events) {
    const detailBox = document.getElementById('calendar-day-detail-box');
    const detailTitle = document.getElementById('calendar-day-detail-title');
    const detailContent = document.getElementById('calendar-day-detail-content');

    if (!detailBox) return;
    detailBox.classList.remove('hidden');
    detailTitle.textContent = `Eventos para el ${dateStr}`;

    if (events.length === 0) {
      detailContent.innerHTML = `<p class="text-xs text-slate-400 py-3">No hay actividades programadas para este día.</p>`;
    } else {
      detailContent.innerHTML = events.map(ev => `
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-800">${ev.title}</p>
            <p class="text-[11px] text-slate-500">${ev.subjectName} (${ev.type})</p>
          </div>
          <span class="text-xs font-semibold ${ev.completed ? 'text-emerald-600' : 'text-amber-600'}">
            ${ev.completed ? '✓ Completado' : '⏳ Pendiente'}
          </span>
        </div>
      `).join('');
    }
  }

  prevMonth() {
    this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
    this.render();
  }

  // ==========================================
  // VIEW 7: TRABAJO EN EQUIPO
  // ==========================================
  renderTeam(state) {
    const team = state.team;
    document.getElementById('team-project-title').textContent = team.projectName;

    // Team members avatars
    const membersList = document.getElementById('team-members-list');
    if (membersList) {
      membersList.innerHTML = team.members.map(m => `
        <div class="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <img src="${m.avatar}" class="w-10 h-10 rounded-full object-cover border-2 border-violet-100" />
          <div>
            <h4 class="text-xs font-bold text-slate-900">${m.name}</h4>
            <p class="text-[11px] text-slate-500">${m.role}</p>
          </div>
        </div>
      `).join('');
    }

    // Populate Kanban Columns
    const statuses = ['todo', 'in_progress', 'done'];
    statuses.forEach(status => {
      const col = document.getElementById(`kanban-col-${status}`);
      if (!col) return;

      const tasks = team.tasks.filter(t => t.status === status);
      col.innerHTML = tasks.length === 0
        ? `<div class="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">Sin tareas</div>`
        : tasks.map(task => {
          const member = team.members.find(m => m.id === task.assigneeId) || { name: 'Sin asignar', avatar: '' };
          const priorityCls = {
            alta: 'bg-rose-100 text-rose-700',
            media: 'bg-amber-100 text-amber-700',
            baja: 'bg-slate-100 text-slate-700'
          }[task.priority] || 'bg-slate-100 text-slate-700';

          return `
              <div class="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow transition-all space-y-2.5">
                <div class="flex items-start justify-between gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityCls}">
                    ${task.priority}
                  </span>
                  <div class="relative inline-block text-left">
                    <select class="text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-lg px-1.5 py-0.5 border-none cursor-pointer" onchange="window.visariApp.store.updateTeamTaskStatus('${task.id}', this.value)">
                      <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>Por hacer</option>
                      <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>En curso</option>
                      <option value="done" ${task.status === 'done' ? 'selected' : ''}>Completado</option>
                    </select>
                  </div>
                </div>
                <h4 class="text-xs font-bold text-slate-800 leading-snug">${task.title}</h4>
                <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div class="flex items-center gap-1.5">
                    <img src="${member.avatar}" class="w-5 h-5 rounded-full object-cover" />
                    <span class="text-[11px] text-slate-600 font-medium truncate max-w-[90px]">${member.name}</span>
                  </div>
                  <span class="text-[10px] text-slate-400 font-medium">📅 ${task.dueDate}</span>
                </div>
              </div>
            `;
        }).join('');
    });
  }

  openNewTeamTaskModal() {
    const modal = document.getElementById('modal-new-team-task');
    const selectMember = document.getElementById('team-task-assignee');
    if (selectMember) {
      selectMember.innerHTML = this.store.state.team.members.map(m => `
        <option value="${m.id}">${m.name}</option>
      `).join('');
    }
    if (modal) modal.classList.remove('hidden');
  }

  closeNewTeamTaskModal() {
    const modal = document.getElementById('modal-new-team-task');
    if (modal) modal.classList.add('hidden');
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.visariApp = new VisariApp();
});
