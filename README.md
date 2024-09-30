# Biblioteca Basquadé

## Overview

La biblioteca Basquadé almacena documentos vinculados al medio ambiente.
Estos documentos pueden buscarse y leerse de forma independiente, o consultando xasos.
Un caso es un conjunto de documentos que guardan relación entre sí.
Asimismo, los casos pueden relacionarse entre sí.

Los documentos están clasificados en las siguientes categorías:

- Trabajos de investigación
- Campamentos sanitarios
- Leyes y ordenanzas
- Sentencias
- Agroecología
- Noticias y recursos
- Protocolos y guías ante contacto con agrotóxicos
- Plantas medicinales

## Requerimientos

### Servicios
Para ejecutar la Basqüadé, se necesita:
- PostgreSQL 16.4
- `tesseract` para lectura OCR de libros

### Variables de entorno
Es necesario tener un archivo al menos un archivo `.env.[ENTORNO].local`, con las siguientes
variables:
|Variable|Valor|
|---|---|
|GOOGLE_CLIENT_ID| ID de cliente OAuth de Google  |
|GOOGLE_CLIENT_SECRET| Secreto del cliente OAuth de Google |
|NEXTAUTH_SECRET| Secreto para usar para auth  |

_NOTA: Se puede generar un secreto para usar en `NEXTAUTH_SECRET` ejecutando
```
openssl rand -base64 32

```

## Cómo ejecutar

1. Cloná el repositorio
2. Ejecuta:
   1. `npm install`
   2. `npx prisma migrate reset`
   3. `npx next dev`
3. Visita `localhost:3000`
