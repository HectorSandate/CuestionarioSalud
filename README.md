
# 🧠 NOM-035 Risk Assessment Web App

Aplicación web full stack que permite aplicar los cuestionarios de la **NOM-035-STPS-2018** para la identificación de factores de riesgo psicosocial y acontecimientos traumáticos severos en trabajadores, con cálculo automático de resultados y generación de reportes.

---

## 📌 Objetivo General

Desarrollar una aplicación web interactiva que permita aplicar los cuestionarios sobre factores de riesgo psicosocial (según la NOM-035) a los trabajadores de una organización. La aplicación recoge respuestas, calcula los resultados y proporciona un análisis inicial del nivel de riesgo.

---

## 🎯 Objetivos Específicos

- Digitalizar los cuestionarios oficiales de la NOM-035:
  - Acontecimientos Traumáticos Severos
  - Factores de Riesgo Psicosocial
  - Evaluación del Entorno Organizacional
- Almacenar respuestas de forma segura.
- Calcular el nivel de riesgo automáticamente.
- Mostrar resultados con recomendaciones personalizadas.
- Facilitar el análisis de RRHH mediante reportes claros.

---

## 🚀 Tecnologías utilizadas

- **Frontend:** React + Vite + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + API REST)
- **Base de datos:** Supabase PostgreSQL
- **Autenticación:** Supabase Auth (correo + contraseña)


---

## 🧩 Estructura del Proyecto

```
/src
  /pages
    ├── Login.tsx
    ├── Register.tsx
    ├── Dashboard.tsx
    ├── TraumaticEventsAssessment.tsx
    ├── AssessmentResult.tsx
    └── AssessmentsList.tsx
  /contexts
    └── AuthContext.tsx
  /lib
    └── supabase.ts
App.tsx
index.tsx
```

---

## 👥 Funcionalidades

### ✅ Autenticación
- Registro de usuarios con correo y contraseña
- Inicio de sesión y cierre de sesión
- Autenticación persistente con `AuthContext`

### 📝 Cuestionarios disponibles
- ✅ Cuestionario de Acontecimientos Traumáticos Severos
- ⏳ Cuestionario de Factores de Riesgo Psicosocial *(en desarrollo)*
- ⏳ Evaluación del Entorno Organizacional *(en desarrollo)*

### 🧠 Lógica de Cálculo
- Clasificación automática del nivel de riesgo: **Bajo**, **Medio**, **Alto**
- Cálculo con base en respuestas de opción múltiple
- Reglas establecidas por la NOM-035

### 📊 Reportes
- Página con resultados individuales
- Página con lista de todos los assessments completados
- Indicadores visuales de nivel de riesgo por usuario
- Recomendaciones personalizadas

---

## 🧪 Usuario de prueba

Puedes iniciar sesión con el siguiente usuario:

```bash
📧 Email:    test@example.com
🔑 Password: test123456
```

---

## 📦 Instalación y uso local

```bash
# Clona el repositorio
git clone https://github.com/HectorSandate/CuestionarioSalud.git
cd nom035-app

# Instala dependencias
npm install

# Ejecuta el proyecto
npm run dev
```

---

## 🛠️ Supabase setup (resumen)

1. Crear un proyecto en [https://supabase.io](https://supabase.io)
2. Crear las tablas `profiles`, `assessments`, `assessment_results`
3. Aplicar políticas de RLS
4. Habilitar autenticación por correo
5. Configurar las variables de entorno:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

---

## 📌 Pendientes / Siguientes pasos

- [ ] Implementar los otros dos cuestionarios oficiales
- [ ] Agregar validaciones por tipo de usuario (admin, trabajador)
- [ ] Exportar resultados en PDF o Excel
- [ ] Mejorar UI/UX (modo oscuro, mobile friendly)

---

## 📄 Requisitos del proyecto

> Materia: Desarrollo Web Profesional  
> Profesor: Raúl Iván Herrera González  
> Ejercicio XI - Evaluación de Factores de Riesgo Psicosocial (NOM-035)

---

## 📚 Documentación Técnica

**Arquitectura:**
- App modular en React con rutas protegidas
- Supabase como Backend-as-a-Service (auth + base de datos)
- Context API para manejo global del usuario

**Retos enfrentados:**
- Implementación de lógica personalizada para el cálculo de riesgos
- Restricciones por claves foráneas en Supabase (resuelto con control en `profiles`)
- UI intuitiva para facilitar el llenado de cuestionarios extensos

---

[!IMPORTANT]  
## 🧑‍💻 Autor

**Hecho Solo Por Diaz Sandate Hector Jose**  
[GitHub](https://github.com/HectorSandate)  
Desarrollador Web Full Stack
