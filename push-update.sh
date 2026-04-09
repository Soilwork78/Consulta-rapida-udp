#!/bin/bash
# ============================================================
# push-update.sh — Actualizar GitHub con los archivos v1.1
#
# USO:
#   bash push-update.sh NOMBRE_DEL_REPO
#
# EJEMPLO:
#   bash push-update.sh consulta-rapida-enf
#
# Este script clona el repo, reemplaza los archivos actualizados
# y hace push manteniendo los íconos y README existentes.
# ============================================================

GITHUB_USER="Soilwork78"
REPO_NAME=${1:-""}

if [ -z "$REPO_NAME" ]; then
  echo "❌ Debes indicar el nombre del repo."
  echo "   Ejemplo: bash push-update.sh consulta-rapida-enf"
  exit 1
fi

REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
CLONE_DIR="/tmp/repo-update-$$"
SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📥 Clonando repo desde GitHub..."
git clone "$REPO_URL" "$CLONE_DIR" || { echo "❌ Error al clonar. Verifica el nombre del repo."; exit 1; }

echo "📋 Copiando archivos actualizados..."
# Core app files
cp "$SOURCE_DIR/index.html"   "$CLONE_DIR/index.html"
cp "$SOURCE_DIR/app.js"       "$CLONE_DIR/app.js"
cp "$SOURCE_DIR/cdss.js"      "$CLONE_DIR/cdss.js"
cp "$SOURCE_DIR/data.js"      "$CLONE_DIR/data.js"
cp "$SOURCE_DIR/extras.js"    "$CLONE_DIR/extras.js"
cp "$SOURCE_DIR/sw.js"        "$CLONE_DIR/sw.js"
cp "$SOURCE_DIR/manifest.json" "$CLONE_DIR/manifest.json"
cp "$SOURCE_DIR/.gitignore"   "$CLONE_DIR/.gitignore" 2>/dev/null || true
# Presentaciones Farmacología
for f in antibioticos-slides.html unidad1-bases-slides.html unidad2-antiinfecciosos-slides.html \
          unidad3-cardiovascular-slides.html unidad4-endocrina-slides.html \
          unidad5-snc-slides.html unidad6-digestivo-slides.html; do
  [ -f "$SOURCE_DIR/$f" ] && cp "$SOURCE_DIR/$f" "$CLONE_DIR/$f"
done
# Presentaciones Fisiopatología
for f in fisio-u1-celular-slides.html fisio-u2-respiratoria-slides.html \
          fisio-u3-cardiovascular-slides.html fisio-u4-endocrina-slides.html \
          fisio-u5-renal-slides.html fisio-u6-neuro-slides.html fisio-u7-hematologia-slides.html; do
  [ -f "$SOURCE_DIR/$f" ] && cp "$SOURCE_DIR/$f" "$CLONE_DIR/$f"
done
# Presentaciones Cuidados de Enfermería 2
for f in cuid2-u1-humanizado-slides.html cuid2-u2-proceso-slides.html \
          cuid2-u3-iaas-slides.html cuid2-u4-tmsv-slides.html \
          cuid2-u5-calculo-slides.html cuid2-u6-hidratacion-slides.html \
          cuid2-u7-eliminacion-slides.html cuid2-u8-nutricion-slides.html \
          cuid2-u9-balance-slides.html cuid2-u10-inhalatoria-slides.html \
          cuid2-u11-rcp-slides.html cuid2-u12-visita-slides.html \
          cuid2-u13-postmortem-slides.html; do
  [ -f "$SOURCE_DIR/$f" ] && cp "$SOURCE_DIR/$f" "$CLONE_DIR/$f"
done

echo "📝 Preparando commit..."
cd "$CLONE_DIR"
git config user.email "rpincheiragonzalez@gmail.com"
git config user.name "Rodrigo Pincheira"

git add -A

git diff --cached --stat

git commit -m "feat: v3.0 — Dark home · Cincinnati/GSA directos · Cuidados 2 completo + referencias cruzadas

Cambios principales:
- 🎨 Pantalla principal rediseñada: dark theme, orbes animados, partículas flotantes, glassmorphism
- 🏠 Hero con badge v3.0, cards con clases sc-farm/sc-fisio/sc-cuid, quick-btn row
- 🧠 Cincinnati y GSA ahora accesibles directo desde la barra de Anexos (sin sub-menú)
- 🔗 Tab 'Nexos' eliminado del sidebar
- 💙 Cuidados 2 (ENF3015): 13 sesiones con topics/keywords/alerts/connections completos
- 📊 Referencias cruzadas: cada clase de Cuidados 2 enlaza a sesiones de Farmaco y Fisiopato
- 🐛 Fix: sidebar unit header mostraba 'undefined' (clave .unit → .title)
- 🐛 Fix: click en sesiones de Cuidados no mostraba contenido (arrays vacíos → poblados)
- SW actualizado a v3.0
- Test suite: 103/103 ✅"

echo ""
echo "🚀 Haciendo push a GitHub..."
git push origin main || git push origin master

echo ""
echo "✅ ¡Listo! Cambios publicados en:"
echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "📱 GitHub Pages (si está habilitado):"
echo "   https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""

# Limpiar carpeta temporal
cd / && rm -rf "$CLONE_DIR"
