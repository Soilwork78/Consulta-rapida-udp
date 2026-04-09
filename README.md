# Consulta Rápida Enfermería UDP v1

Presentaciones interactivas para 2° año Enfermería UDP - Cursos ENF3015.

## Archivos Disponibles

### 1. IAAS · PAPE · Antisépticos y Desinfectantes
**Archivo:** `cuid2-u3-iaas-slides.html`
- **15 slides** | Accent: #f59e0b (Ámbar/Dorado)
- Covers: IAAS definition, epidemiologic chain, types, standard precautions, hand hygiene, PAPE protocol, antiseptics vs disinfectants, alcohol 70%, chlorhexidine, povidone iodine, disinfectants, triclosan, decontamination levels, clinical summary

### 2. Toma de Muestra de Sangre Venosa (TMSV)
**Archivo:** `cuid2-u4-tmsv-slides.html`
- **14 slides** | Accent: #e879f9 (Fuchsia/Rosa)
- Covers: Venous puncture definition, devices, puncture sites, preliminary considerations, materials, technique, vacutainer system, tube fill order, syringe emptying, common errors, complications, pre-analytical phase, post-procedure care

### 3. Cálculo de Dosis y Goteo
**Archivo:** `cuid2-u5-calculo-slides.html`
- **13 slides** | Accent: #34d399 (Esmeralda/Verde)
- Covers: Learning outcomes, perfusion systems, flow factor, drops/min formula, micro-drops/min formula, infusion velocity (mL/hr), complete exercises, dose calculation rules, medication presentations, comprehensive clinical cases

## Features del Diseño

- ✓ **Glassmorphism:** Blur + transparency effects con gradientes
- ✓ **Scroll Snap:** Navegación de pantalla completa (100vh per slide)
- ✓ **Animaciones:** float, pulse-ring, slideIn, fadeInUp, shimmer, particle-drift
- ✓ **15 Partículas** en cada slide con animación drift única
- ✓ **IntersectionObserver:** Elementos se animan al ser visibles (reveal)
- ✓ **Navegación Completa:**
  - Puntos de navegación (nav dots) a la derecha
  - Barra de progreso top
  - Navegación por teclado (↑/↓)
  - Navegación táctil (swipe)
- ✓ **Typography:** Google Font Manrope con clamp() para responsividad
- ✓ **Dark Theme:** #0b1520 background, #16263a cards
- ✓ **Totalmente Independiente:** Todos los CSS y JS inlined (sin dependencias externas excepto Google Fonts)

## Cómo Usar

1. Abre cualquiera de los archivos HTML en un navegador web
2. Desplázate con:
   - **Rueda del mouse** (scroll normal)
   - **Teclas ↑/↓** (navegación por teclado)
   - **Swipe en móvil** (toca y desliza)
   - **Puntos de navegación** (haz clic en los puntos a la derecha)

3. Las animaciones se activan automáticamente mientras se desplaza

## Estructura Técnica

### CSS Base (presente en todos los archivos)
- Dark background: #0b1520
- Card background: #16263a (glassmorphism)
- scroll-snap-type: y mandatory en html
- Cada .slide = 100vh con scroll-snap-align: start
- Manrope font con clamp() para tamaños responsive
- 15 partículas animadas por slide
- IntersectionObserver para reveales progresivos

### JavaScript Incluido
- Generación procedural de 15 partículas por slide
- IntersectionObserver para animaciones de reveal
- Navegación interactiva con puntos
- Actualización de barra de progreso
- Navegación por teclado (ArrowUp/ArrowDown)
- Navegación táctil (swipe gestures)

## Paleta de Colores

| Archivo | Accent | RGB |
|---------|--------|-----|
| IAAS | #f59e0b | Ámbar/Dorado |
| TMSV | #e879f9 | Fuchsia/Rosa |
| Cálculo | #34d399 | Esmeralda/Verde |

## Notas de Diseño

- Todos los tamaños de fuente usan `clamp(min, preferred, max)` para responsividad perfecta
- Las animaciones están optimizadas para no impactar rendimiento (usando CSS animations)
- Los elementos `data-reveal` esperan hasta ser visibles para animar (IntersectionObserver)
- Las partículas usan CSS variables para posiciones dinámicas
- Glassmorphism usa `backdrop-filter: blur(12px)` con color accent a 0.2 alpha para bordes

## Compatibilidad

- Browsers modernos (Chrome 80+, Firefox 75+, Safari 13+)
- Responsive desde móvil hasta desktop
- Touch-friendly navigation
- No requiere internet después de carga (excepto Google Fonts en primera carga)

---
Created: April 8, 2025 | UDP Nursing Education
