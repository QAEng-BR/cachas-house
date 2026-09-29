# CLAUDE.md — Cachas House (cachashouse.com)

Contexto para seguir editando y desplegando el sitio. Léelo antes de tocar código y actualízalo cuando cambie la estructura.
Última revisión: 2026-09-28 · commit `2871e5d`.

## 1. Resumen

- **Negocio**: Cachas House, carpintería arquitectónica en Colombia: cocinas integrales, closets y vestieres, muebles de TV y baño, centros de entretenimiento (melamina RH).
- **Sitio**: estático y sin build. Cada página lleva su HTML, CSS y JS *inline*. Idioma: español (`lang="es"`).
- **Hosting**: GitHub Pages desde `main` (raíz) con dominio `cachashouse.com` (archivo `CNAME`; el DNS apunta a las IPs de GitHub Pages). Repo: `github.com/QAEng-BR/cachas-house`.
- **Backend**: Firebase plan **Spark (gratis, sin tarjeta — decisión: sin costos ni servicios extra)**, proyecto `cachashouse-322a2`: Realtime Database + Authentication (Google para admins). Sin Storage ni Functions (requieren Blaze).
- **Contacto del negocio**: WhatsApp/tel `+57 301 2476888` · `cachashouse@gmail.com`.

## 2. Estructura del repo

| Ruta | Qué es | Notas |
|---|---|---|
| `index.html` | Landing (~2.375 líneas) | CSS L19–1121 · HTML L1123–1496 · JS L1498–2373 |
| `seguimiento.html` | Seguimiento para clientes (solo vista cliente) | `noindex` |
| `admin.html` | Panel admin (login con Google) | `noindex`. Tabla de proyectos, crear/editar/eliminar, WhatsApp, migrar teléfonos |
| `js/cachas-firebase.js` | Config de Firebase, `STAGES`, `ADMIN_EMAILS`, `esc`, `isAdminUser` | lo cargan admin.html (y futuras páginas) |
| `firebase/database.rules.json` | Reglas de la RTDB | se publican **a mano** en Firebase Console → Realtime Database → Reglas |
| `fotos/` | 67 JPG del portafolio (`IMG_XXXX.jpg`) | 4032×3024, ~2,4 MB c/u (164 MB). Sin GPS en EXIF |
| `images/logo/logo.png` | Logo oscuro | nav con scroll y seguimiento.html |
| `images/logo/logo-light.png` | Logo claro | nav sobre el hero |
| `images/LOGO-VERSION1(4).png` | Logo blanco del footer | el nombre lleva paréntesis: no renombrar sin actualizar las 2 páginas |
| `images/Fondo.png` | Fondo del hero (parallax) | 1,8 MB |
| `images/galeria/` | Galería vieja por categorías | **no se usa** (61 MB) |
| `brand-guide/page_01–11.png`, `CachasHouse-entrega final.pdf` | Manual de marca (11 págs.) | se publican en el sitio: todo lo que no esté excluido en `_config.yml` queda público |
| `CNAME` | `cachashouse.com` | no borrar |
| `_config.yml` | Lista de archivos que Jekyll NO publica | GitHub Pages corre Jekyll (no hay `.nojekyll`) y convertiría los `.md` en páginas |
| `docs/` | Planes técnicos | excluido del sitio |
| `.vscode/` | Solo colores (Peacock) | sin versionar |

## 3. Deploy y forma de trabajo

- **Publicar**: commit + push a `main`. GitHub Pages redespliega en ~1 min. No hay staging: lo que llega a `main` sale en vivo. Hay ~10 min de caché, así que verifica con recarga forzada (Cmd+Shift+R).
- **Probar en local**: desde la raíz, `python3 -m http.server 8000` y abrir `http://localhost:8000` (o Live Server). Firebase funciona desde localhost.
- **No hay** build, dependencias, linters ni tests automáticos.
- **Commits** en inglés, en imperativo y descriptivos, como en el historial (`Add delivery date + on-track/delay status to client card…`).
- **Regla de trabajo**: al extender algo, conserva la lógica que ya funciona y agrega las mejoras encima. No reescribas secciones enteras sin necesidad.
- **Checklist antes de push**: abrir las dos páginas, consola sin errores, vista móvil (375 px), buscar un código real en seguimiento y probar el formulario → WhatsApp.
- **Desde Cowork** (carpeta conectada, sin permiso de borrar): usa `git --no-optional-locks status`. Si queda un `.git/index.lock` huérfano, renómbralo (`mv`) o bórralo.

## 4. Marca y sistema visual

Tokens CSS en `:root`. Están duplicados en las dos páginas, así que cualquier cambio va en ambas.

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F0EDE6` | fondo |
| `--surf` / `--surf2` | `#F8F5EF` / `#E4DED4` | superficies |
| `--dark` | `#3D3935` | secciones oscuras |
| `--text` | `#544F4B` | texto (color de marca) |
| `--muted` | `#968372` | texto secundario (marca) |
| `--faint` | `#BAB2A8` | detalles |
| `--accent` | `#EBB478` | ámbar (en el manual: `#EBB476`) |
| `--accentdk` | `#A8672F` | ámbar oscuro (marca) |
| `--blue` | `#738595` | azul (marca; solo en index) |
| `--cream` | `#EBE7DF` | crema (marca) |

- **Tipografía de marca**: la primaria es *Smooth Circulars* (solo minúsculas, la del logo) y la secundaria *Gilroy*. En la web se usa **Poppins** (Google Fonts) como sustituto.
- **Estilo**:
  - etiquetas en minúsculas (`.s-label`);
  - títulos `.s-title` con acento en `<em>` (itálica ámbar);
  - animación de entrada `.rev` con `data-d="1…6"` para el retraso;
  - cursor propio en index (`#cur`, `#cur-ring`, `body{cursor:none}`).
- **Breakpoints**: index `1100 / 768 / 480 px`; seguimiento `600 px`.

## 5. Mapa de `index.html`

| Ancla / bloque | Contenido | Datos / JS |
|---|---|---|
| `nav#nav` + `#mob` | Links, CTA "cotizar", menú móvil (burger) | `.nav.on` pasados 60 px de scroll (logo claro → oscuro) |
| `section#inicio` | Hero con fondo `Fondo.png` y parallax, texto, 2 CTAs, slideshow a la derecha | `HERO_IMGS` (6 fotos, cambia cada 5 s) |
| `.marquee` | Cinta de servicios | la lista va duplicada para el loop |
| `.intro` | "Cachas House es tu casa…" | — |
| `section#galeria` | 1) intro 3D (cocina armándose) 2) carrusel del portafolio + lightbox `#lb` | Three.js 0.158 (jsDelivr) se carga al entrar o al hacer clic en "galería"; `ITEMS` (67 fotos, auto 5 s, swipe) |
| `section#nosotros` | "Quiénes somos", 2 fotos, badge "3+ años" | `IMG_8172`, `IMG_7593` |
| `.stats` | Contadores 200+ / 3+ / 90 % | `.cnt[data-t]` |
| `section#proceso` | 4 pasos del proceso | — |
| `section#contacto` | Datos + formulario | `#contact-form` → abre `wa.me/573012476888` con el mensaje formateado |
| `section#seguimiento` | Teaser → `seguimiento.html` | — |
| `footer` | Logo blanco, ©, links | año fijo "© 2025" |

**Bloques JS**. Para ubicarlos, busca el comentario marcador `/* ─── NOMBRE`:

- `GALLERY DATA`
- `HERO IMAGE SHOWCASE`
- `HERO PARALLAX`
- `GALLERY CAROUSEL`
- `REVEAL`
- `COUNTERS`
- `CURSOR`
- `NAV`
- `MOBILE MENU`
- `LIGHTBOX`
- `PROJECT TRACKING`: **código muerto**. Empieza con `return;`; la lógica real vive en `seguimiento.html`.
- `FORM → WHATSAPP`
- `KITCHEN ASSEMBLY ANIMATION`

## 6. Mapa de `seguimiento.html`

**Cliente**
- Input `#trk-input` (formato `ABC-123`) y botón `#trk-search-btn`. Si la URL trae `?code=ABC-123`, lo rellena y busca solo.
- `searchProject()` lee `cachas-projects/{CODE}` con `.get()` y llama a `renderCard(p)`. La tarjeta muestra:
  - nombre y cliente;
  - stepper de 7 etapas con barra de progreso y etapa actual;
  - fecha de actualización;
  - entrega estimada con el chip "seguimos on track" o "actualización de plazo" más la razón.

**Admin** (`#trk-admin-toggle` abre el panel)
- **Login**: `tryLogin()` compara el SHA-256 de la contraseña con `ADMIN_HASH` dentro del navegador. No es autenticación real (ver §8).
- **Tabla en vivo**: `startLiveTable()` escucha `cachas-projects` completo (`on('value')`) y `renderTable()` re-dibuja la tabla en cada cambio.
- **Edición inline**: los inputs de texto, teléfono y fecha guardan en `blur` (`set` del campo). El `<select>` de etapa guarda `status` + `updatedAt`.
- **WhatsApp**: arma el mensaje y abre `wa.me/<teléfono>`. En móvil usa emojis con `String.fromCodePoint()`; en desktop usa `*negrita*` / `~tachado~`.
- **eliminar** (con `confirm`) y **+ agregar proyecto** (modal `#trk-modal-overlay` → `createProject()` con `genCode()`).

**Funciones clave**:
- `hashInput`
- `searchProject`
- `renderCard`
- `tryLogin`
- `genCode`
- `startLiveTable`
- `renderTable`
- `esc`
- `openModal` / `closeModal` / `createProject`

## 7. Datos: Firebase Realtime Database

- URL: `https://cachashouse-322a2-default-rtdb.firebaseio.com/`. SDK **compat 9.22.0** vía `<script>` (app + database). Todos los scripts de Firebase deben usar la misma versión.
- Init: `firebase.initializeApp({ databaseURL }, 'cachas-tracking')`. Es una app con nombre que solo trae `databaseURL`; para Auth o Storage hace falta la config completa.
- Nodo: `cachas-projects/{CODE}`

| Campo | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `client` | string | `Juan García` | |
| `project` | string | `Cocina integral` | |
| `phone` | string | `+57 300 000 0000` | se usa para el WhatsApp |
| `status` | number 0–6 | `2` | índice dentro de `STAGES` |
| `deliveryDate` | string | `2026-10-15` | formato `YYYY-MM-DD`. Se parsea con `'T12:00:00'` para que la zona horaria no corra el día |
| `delayReason` | string | `''` | si tiene texto, el cliente ve "actualización de plazo" |
| `updatedAt` | string ISO | `2026-06-01T15:04:05.000Z` | solo cambia al cambiar la etapa |

- **`STAGES`**. Lo que se guarda es el índice, así que **no reordenes ni insertes etapas en medio** sin migrar los datos:
  - 0 Material en corte
  - 1 Material en el taller
  - 2 Ensamble en taller
  - 3 Control de calidad
  - 4 Alistamiento para instalación
  - 5 Instalación en sitio
  - 6 Entrega final
- **Código de proyecto**: 3 letras (sin I ni O) + `-` + 3 dígitos. `genCode()` no revisa colisiones: la probabilidad es ínfima, pero `set()` sobrescribiría el proyecto existente.

## 8. Seguridad (Fase 1 aplicada 2026-09-28)

- Admin entra en `admin.html` con **Google**; solo `cachashouse@gmail.com` y `brahianrinconsanchez01@gmail.com` (lista en `js/cachas-firebase.js` **y** en las reglas: cambiar ambas).
- Reglas (`firebase/database.rules.json`): el cliente solo puede leer `cachas-projects/{CODE}` sabiendo el código; listar, escribir y leer `cachas-private` (teléfonos) requiere ser admin. Verificado: sin sesión → listar 401, escribir 401, leer un código 200.
- Los teléfonos viven en `cachas-private/{CODE}/phone` (migrados).
- `X-Frame-Options`/`X-Content-Type-Options` en `<meta>` no tienen efecto (GitHub Pages no permite headers).
- XSS: usar `esc()` o `textContent` al insertar datos.

## 9. Deuda técnica y mejoras rápidas

- [ ] El mensaje de WhatsApp enlaza a `https://qaeng-br.github.io/cachas-house/seguimiento.html?code=`. Debe ser `https://cachashouse.com/seguimiento.html?code=`.
- [ ] `index.html` carga el SDK de Firebase y tiene el bloque `PROJECT TRACKING` muerto. Hay que eliminar ambos.
- [ ] Quedan restos sin su HTML: handlers de `.filt` (los filtros de la galería ya no existen), `.g-item` y `.trk-code-chip` en index.
- [ ] `images/galeria/` (61 MB) no se usa: borrarla.
- [ ] `fotos/` está en resolución completa (164 MB). Exportar a ~2000 px y ~300–400 KB (JPG o WebP) haría que carguen mucho más rápido.
- [ ] No hay favicon ni etiquetas Open Graph, así que el link compartido por WhatsApp sale sin vista previa.
- [ ] El año del footer está fijo ("© 2025") en las dos páginas.
- [ ] `STAGES`, los tokens CSS y la config de Firebase están duplicados entre páginas.
- [ ] En el panel, `renderTable()` re-dibuja todo con cada cambio. Si otra persona edita al mismo tiempo, el campo que estás editando pierde el foco.

## 10. Recetas

- **Agregar una foto al portafolio**: cópiala a `fotos/` y agrega `{ cat:'portfolio', catLabel:'portafolio', title:'', img:'fotos/NOMBRE.jpg', ratio:'4/3' }` en `ITEMS` (index, bloque `GALLERY DATA`). Para que salga en el hero, agrégala también a `HERO_IMGS`.
- **Cambiar textos**: búscalos por el ancla de la sección (tabla del §5).
- **Cambiar el número de WhatsApp**: en `FORM → WHATSAPP` (`wa.me/573012476888`) y en el texto visible de `#contacto`.
- **Cambiar etapas**: edita `STAGES` en `seguimiento.html` (y en el bloque muerto de index, si sigue ahí). Renombrar es seguro; reordenar o insertar obliga a migrar `status`.
- **Cambiar la contraseña admin** (mientras siga el esquema actual): `echo -n 'nueva' | shasum -a 256` y pega el resultado en `ADMIN_HASH`.
- **Emojis en JS**: usa `String.fromCodePoint(0x…)`. Nunca pegues el emoji literal: ya hubo problemas de encoding con eso.
- **Publicar un archivo nuevo que no debe verse en el sitio**: agrégalo a `exclude` en `_config.yml`.

## 11. Roadmap

1. **Portal de constructores**: acceso a los proyectos en curso, fotos y novedades con aprobación del admin. Ver `docs/plan-portal-constructores.md`.
