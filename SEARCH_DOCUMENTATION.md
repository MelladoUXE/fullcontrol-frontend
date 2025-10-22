# Búsqueda Global Avanzada 🔍

## 📊 Características Implementadas

### 1. **GlobalSearch Component** (`components/global-search.tsx`)

Componente de búsqueda modal con resultados en tiempo real.

**Características:**
- ⌨️ Atajo de teclado: **Ctrl+K** (Windows/Linux) o **⌘+K** (Mac)
- 🔍 Búsqueda multi-entidad (empleados, registros, logs)
- ⚡ Debounce de 300ms para optimizar requests
- 📊 Resultados agrupados por tipo
- 🎨 Iconos contextuales por tipo de resultado
- 📱 Totalmente responsive
- ⌨️ Navegación por teclado (↑↓ + Enter)
- 🚀 Preview de resultados inline

### 2. **SearchService** (`lib/search-service.ts`)

Servicio centralizado de búsqueda.

**Funcionalidades:**
```typescript
// Búsqueda combinada local
await searchService.performLocalSearch(query);

// Búsquedas específicas
await searchService.searchUsers(query);
await searchService.searchTimeEntries(query);
await searchService.searchAuditLogs(query);
```

**Tipos de Búsqueda:**
1. **Empleados** 👤
   - Nombre
   - Email
   - Rol
   - Empresa

2. **Registros de Tiempo** ⏰
   - Descripción
   - Usuario
   - Fecha
   - Horas

3. **Logs de Auditoría** 🛡️
   - Descripción de acción
   - Usuario que realizó la acción
   - Tipo de entidad
   - Fecha

### 3. **Integración en AppLayout**

```tsx
<GlobalSearch />
```

**Hint Visual en Header:**
```
Presiona Ctrl+K para buscar
```

---

## 🎯 Uso

### Para Usuarios

1. **Abrir Búsqueda:**
   - Presiona `Ctrl+K` (Windows/Linux)
   - Presiona `⌘+K` (Mac)
   - El modal aparece automáticamente

2. **Buscar:**
   - Escribe mínimo 2 caracteres
   - Los resultados aparecen en tiempo real
   - Agrupados por categoría

3. **Navegar:**
   - Usa `↑` y `↓` para moverte
   - Presiona `Enter` para abrir
   - Presiona `Esc` para cerrar

4. **Resultados Mostrados:**
   - **Empleados**: Nombre, email, rol
   - **Registros**: Horas, fecha, descripción
   - **Logs**: Acción, usuario, fecha

### Para Desarrolladores

#### **Extender con Nuevas Entidades**

1. Agregar tipo en `search-service.ts`:
```typescript
export interface SearchResult {
  id: number | string;
  type: 'user' | 'time_entry' | 'approval' | 'vacation' | 'reminder' | 'audit' | 'NEW_TYPE';
  // ...
}
```

2. Crear método de búsqueda:
```typescript
async searchNewEntity(query: string): Promise<SearchResult[]> {
  try {
    const response = await axios.get(`${API_URL}/new-entity`, {
      params: { search: query },
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data.map((item: any) => ({
      id: item.id,
      type: 'NEW_TYPE',
      title: item.name,
      description: item.details,
      url: `/new-entity/${item.id}`,
      icon: 'icon-name',
    }));
  } catch (error) {
    return [];
  }
}
```

3. Agregar icono en `global-search.tsx`:
```typescript
const iconMap = {
  // ... existing
  NEW_TYPE: NewIcon,
};
```

4. Agregar grupo en el render:
```typescript
{renderResultGroup('Nuevo Tipo', results.new_items, 'NEW_TYPE')}
```

#### **Personalizar Debounce**

```typescript
// En GlobalSearch component
useEffect(() => {
  const timer = setTimeout(() => {
    performSearch(query);
  }, 500); // Cambiar de 300ms a 500ms

  return () => clearTimeout(timer);
}, [query, performSearch]);
```

#### **Cambiar Atajo de Teclado**

```typescript
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    // Cambiar a Ctrl+P
    if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };
  // ...
}, []);
```

---

## 🎨 Diseño Visual

### **Modal de Búsqueda**
```
┌────────────────────────────────────────┐
│ 🔍 Buscar empleados, registros...      │
├────────────────────────────────────────┤
│ Empleados                              │
│ 👤 Juan Pérez                          │
│    juan@email.com - Manager            │
│ 👤 María García                        │
│    maria@email.com - Employee          │
├────────────────────────────────────────┤
│ Registros de Tiempo                    │
│ ⏰ 8 horas - Juan Pérez                │
│    2025-10-22 - Desarrollo             │
├────────────────────────────────────────┤
│ Logs de Auditoría                      │
│ 🛡️ Usuario creado: María García        │
│    Admin - hace 2h                     │
├────────────────────────────────────────┤
│ 5 resultados encontrados               │
├────────────────────────────────────────┤
│ ↑↓ navegar  ↵ seleccionar  Esc cerrar │
│                         Ctrl+K abrir → │
└────────────────────────────────────────┘
```

### **Hint en Header**
```
Presiona [Ctrl+K] para buscar
```

---

## ⚡ Performance

### **Optimizaciones Implementadas**

1. **Debounce (300ms)**
   - Evita requests innecesarios
   - Reduce carga en el servidor
   - Mejora UX con resultados rápidos

2. **Límite de Resultados**
   - Máximo 5 resultados por categoría
   - Total de 15 resultados mostrados
   - Renderizado optimizado

3. **Lazy Loading**
   - Modal solo se monta cuando se abre
   - Búsqueda solo se ejecuta con 2+ caracteres
   - Cleanup de timers automático

4. **Memoization**
   - Callbacks memoizados con `useCallback`
   - Previene re-renders innecesarios

---

## 🔧 Configuración

### **Variables de Entorno**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **Dependencias Instaladas**

```json
{
  "axios": "^1.12.2",
  "cmdk": "^1.0.0" // Incluido con shadcn command
}
```

---

## 🐛 Troubleshooting

### **El atajo Ctrl+K no funciona**
**Solución:** Verificar que no haya otro handler global capturando el evento.

### **No aparecen resultados**
**Causas posibles:**
1. Query < 2 caracteres
2. Backend no responde
3. Token expirado
4. Sin permisos para ver la entidad

**Solución:** Verificar consola del navegador para errores.

### **Búsqueda muy lenta**
**Optimizaciones:**
1. Aumentar debounce a 500ms
2. Reducir límite de resultados
3. Implementar caché en el frontend
4. Optimizar queries en el backend

### **Modal no se cierra con Esc**
**Solución:** Verificar que no haya z-index conflictivo o event.stopPropagation().

---

## 📈 Próximos Pasos

### **Mejoras Sugeridas**

1. **Búsqueda por Voz** 🎤
   ```typescript
   // Web Speech API
   const recognition = new webkitSpeechRecognition();
   recognition.onresult = (event) => {
     setQuery(event.results[0][0].transcript);
   };
   ```

2. **Historial de Búsquedas** 📜
   ```typescript
   // Guardar en localStorage
   const recentSearches = JSON.parse(
     localStorage.getItem('recent_searches') || '[]'
   );
   ```

3. **Búsqueda con Filtros** 🎯
   ```typescript
   <Select value={filterType}>
     <option value="all">Todos</option>
     <option value="users">Solo Empleados</option>
     <option value="logs">Solo Logs</option>
   </Select>
   ```

4. **Sugerencias Inteligentes** 💡
   ```typescript
   // Mostrar sugerencias populares al abrir
   const popularSearches = [
     'empleados activos',
     'registros de hoy',
     'logs de la semana'
   ];
   ```

5. **Búsqueda Difusa (Fuzzy)** 🔎
   ```typescript
   // Usar fuse.js para búsqueda tolerante a errores
   import Fuse from 'fuse.js';
   const fuse = new Fuse(items, { keys: ['name', 'email'] });
   ```

6. **Exportar Resultados** 📥
   ```typescript
   const exportResults = () => {
     const csv = results.map(r => `${r.title},${r.description}`).join('\n');
     download(csv, 'search-results.csv');
   };
   ```

7. **Backend Global Search Endpoint** 🌐
   ```typescript
   // Endpoint único para todas las entidades
   GET /api/search?q=query&types=users,logs&limit=20
   ```

---

## 📊 Métricas de Uso

Para trackear el uso de la búsqueda:

```typescript
const trackSearch = (query: string, resultCount: number) => {
  // Google Analytics, Mixpanel, etc.
  analytics.track('search_performed', {
    query,
    results: resultCount,
    timestamp: new Date(),
  });
};
```

---

## 🎯 Casos de Uso

### **Caso 1: Buscar un Empleado**
```
Usuario: Presiona Ctrl+K
Usuario: Escribe "juan"
Sistema: Muestra empleados llamados Juan
Usuario: Presiona Enter en "Juan Pérez"
Sistema: Navega a /employees
```

### **Caso 2: Buscar Registros de Tiempo**
```
Usuario: Presiona Ctrl+K
Usuario: Escribe "desarrollo"
Sistema: Muestra registros con "desarrollo" en descripción
Usuario: Selecciona un registro
Sistema: Navega a /dashboard
```

### **Caso 3: Buscar en Logs de Auditoría**
```
Usuario: Presiona Ctrl+K
Usuario: Escribe "crear usuario"
Sistema: Muestra logs de creación de usuarios
Usuario: Selecciona un log
Sistema: Navega a /audit con filtro aplicado
```

---

**Creado:** 2025-10-22
**Versión:** 1.0.0
**Estado:** ✅ Funcionando
**Dependencias:** axios, cmdk (shadcn command)
