#!/bin/bash
# ============================================================
# setup-github.sh — Inicializar repo y subir a GitHub
# Ejecutar desde la carpeta raíz del proyecto:
#   bash setup-github.sh TU_USUARIO_GITHUB
# ============================================================

GITHUB_USER=${1:-"TU_USUARIO_GITHUB"}
REPO_NAME="consulta-rapida-enfermeria-udp"

echo "📦 Inicializando repositorio git..."
git init -b main
git config user.email "rpincheiragonzalez@gmail.com"
git config user.name "Rodrigo Pincheira"

echo "📝 Añadiendo archivos..."
git add index.html app.js cdss.js data.js extras.js test_cdss.js antibioticos-slides.html .gitignore

echo "💾 Primer commit..."
git commit -m "feat: Consulta Rápida ENF UDP v1.0

- CDSS engine: 81 fármacos, 70 interacciones, 16 categorías
- Validador de dosis con ajuste clínico (peso, edad, eGFR)
- eGFR visible solo en sección de antibióticos
- Presentación 12 slides: Farmacología Antibióticos
- Asistente IA (Profe IA) integrado con Claude API
- Test suite 103/103 pasando (SEGURO PARA USO)
- Mobile responsive: media queries, sidebar overlay, iOS input fix"

echo ""
echo "✅ Repo local listo."
echo ""
echo "🚀 Para subir a GitHub:"
echo "   1. Crea el repo en: https://github.com/new"
echo "      Nombre sugerido: $REPO_NAME"
echo "      Visibilidad: Private (contiene material académico)"
echo ""
echo "   2. Ejecuta:"
echo "      git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
echo "      git push -u origin main"
echo ""
