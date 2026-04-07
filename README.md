#PROYECTO FINAL - FINQUEST

KANBAN https://trello.com/b/2KYME95B/finquest

# JWT Example: React + Flask

Ejemplo full stack de autenticación JWT con catálogo público y páginas privadas.

Este repositorio ya no es solo el boilerplate original: ahora implementa un flujo completo de `sign_up`, `sign_in`, `me/profile`, catálogo de productos, creación de órdenes y rutas protegidas en React. La referencia pedagógica usada para el enfoque fue `day_28`.

## Qué se hizo

### Backend

- Registro de usuario con contraseña hasheada.
- Login que retorna `access_token` y datos del usuario.
- Endpoint protegido `GET /api/me` y alias `GET /api/profile`.
- Endpoint público `GET /api/products`.
- Endpoint protegido `GET /api/orders` para ver solo las órdenes del usuario autenticado.
- Endpoint protegido `POST /api/orders` para crear compras autenticadas desde el front.
- Nuevos modelos `Product` y `Order`.
- Seed de datos con usuarios demo, productos y órdenes iniciales.

### Frontend

- Página pública de catálogo en `/`.
- Páginas públicas `sign-in` y `sign-up`.
- Páginas privadas `profile` y `orders`.
- Persistencia de sesión JWT en `localStorage`.
- Revalidación de la sesión al recargar la app.
- `PrivateRoute` para bloquear rutas si el usuario no está autenticado.
- Compra desde la galería pública, pero creación real de la orden solo si existe sesión.

## Flujo funcional

```text
Visitante -> ve / y /api/products
Visitante -> sign-up o sign-in
Backend -> devuelve JWT + user
Frontend -> guarda token y user en localStorage
Usuario autenticado -> entra a /profile y /orders
Usuario autenticado -> compra producto desde /
Backend -> crea Order ligada al user_id del token
Usuario autenticado -> solo ve sus propias órdenes
```

## Endpoints

| Método | Endpoint         | Protección | Uso |
| ------ | ---------------- | ---------- | --- |
| GET    | `/api/hello`     | Pública    | Estado rápido de la API |
| POST   | `/api/sign-up`   | Pública    | Crear cuenta y devolver JWT |
| POST   | `/api/sign-in`   | Pública    | Iniciar sesión y devolver JWT |
| POST   | `/api/signup`    | Pública    | Alias del sign-up |
| POST   | `/api/signin`    | Pública    | Alias del sign-in |
| POST   | `/api/token`     | Pública    | Alias legacy del sign-in |
| GET    | `/api/me`        | Protegida  | Usuario autenticado |
| GET    | `/api/profile`   | Protegida  | Alias de `/api/me` |
| GET    | `/api/products`  | Pública    | Catálogo visible para cualquiera |
| GET    | `/api/orders`    | Protegida  | Órdenes del usuario autenticado |
| POST   | `/api/orders`    | Protegida  | Crear orden para un producto |

## Modelos de datos

### `User`

- `id`
- `email`
- `password` (guardada como hash)
- `name`
- `is_active`

### `Product`

- `id`
- `name`
- `slug`
- `description`
- `category`
- `image_url`
- `price`
- `is_active`

### `Order`

- `id`
- `user_id`
- `product_id`
- `quantity`
- `status`
- `unit_price`
- `created_at`

## Cómo ejecutar el proyecto

## Orden recomendado de comandos

Ejecuta estos comandos en este orden dentro de la raíz del proyecto:

### 1. Crear entorno e instalar backend

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Revisar `.env`

Confirma al menos estas variables:

```env
FLASK_APP=src/app.py
FLASK_DEBUG=1
JWT_SECRET_KEY="super-secret-dev-key-change-me-please"
VITE_BACKEND_URL=http://127.0.0.1:3001
```

### 3. Crear tablas con migraciones

```bash
flask --app src/app.py db upgrade
```

### 4. Cargar el seed

Este comando limpia los datos demo anteriores y vuelve a insertar usuarios, productos y órdenes:

```bash
flask --app src/app.py insert-test-data
```

### 5. Levantar el backend

```bash
flask --app src/app.py run -p 3001
```

### 6. En otra terminal, instalar y levantar el frontend

```bash
npm install
npm run dev
```

### 7. Abrir la app

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:3001`

### 1. Backend

Opción simple con `venv`:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Asegúrate de definir en `.env`:

```env
FLASK_APP=src/app.py
FLASK_DEBUG=1
JWT_SECRET_KEY="super-secret-dev-key-change-me-please"
VITE_BACKEND_URL=http://127.0.0.1:3001
```

Si no defines `DATABASE_URL`, Flask usará SQLite en `/tmp/test.db`.

Luego:

```bash
flask --app src/app.py db upgrade
flask --app src/app.py insert-test-data
flask --app src/app.py run -p 3001
```

### 2. Frontend

```bash
npm install
npm run dev
```

## Usuarios demo del seed

- `lara@example.com / demo123`
- `diego@example.com / demo123`

## Usuario recomendado para explorar la app

Puedes usar cualquiera de los dos, pero el recorrido más completo suele ser con:

- `lara@example.com / demo123`

Ese usuario ya tiene órdenes cargadas en el seed, así que sirve para revisar inmediatamente:

- `/profile`
- `/orders`
- el comportamiento de compra desde `/`

Si quieres comparar cómo cambia la experiencia entre usuarios, también puedes entrar con:

- `diego@example.com / demo123`

## Cómo inspeccionarlo

### Desde la app

1. Abre `/` y revisa la galería pública.
2. Intenta comprar sin sesión: el front redirige a `sign-in`.
3. Entra con un usuario demo.
4. Ve a `/profile` para comprobar la ruta protegida.
5. Ve a `/orders` para ver solo las órdenes del usuario autenticado.
6. Compra un producto desde `/` y vuelve a `/orders` para confirmar que se añadió.

### Desde el navegador

- Abre DevTools en la pestaña Network.
- Observa `POST /api/sign-in` o `POST /api/sign-up`.
- Verifica que luego `GET /api/me` y `GET /api/orders` llevan `Authorization: Bearer ...`.

### Desde consola

Ver todas las rutas:

```bash
flask --app src/app.py routes
```

Resetear y reinsertar datos:

```bash
flask --app src/app.py insert-test-data
```

Reaplicar migraciones en base limpia:

```bash
flask --app src/app.py db upgrade
```

## Mapa para inspección de código

### Backend

| Archivo | Qué mirar |
| ------- | --------- |
| `src/api/models.py` | Modelos `User`, `Product`, `Order` y serialización |
| `src/api/routes.py` | Auth, endpoints protegidos y creación de órdenes |
| `src/api/commands.py` | Seed de usuarios, productos y órdenes |
| `src/app.py` | Configuración de Flask, JWT, CORS y registro del blueprint |
| `migrations/versions/bd2f3a0b9b6d_add_products_and_orders.py` | Tablas nuevas de `products` y `orders` |

### Frontend

| Archivo | Qué mirar |
| ------- | --------- |
| `src/front/store.js` | Estado global, persistencia de sesión y reducer |
| `src/front/hooks/useGlobalReducer.jsx` | Context provider + sincronización con `localStorage` |
| `src/front/services/api.js` | Wrapper de `fetch` y headers de auth |
| `src/front/components/PrivateRoute.jsx` | Protección de rutas con redirect a `sign-in` |
| `src/front/pages/Layout.jsx` | Revalidación de sesión al montar la app |
| `src/front/routes.jsx` | Registro de rutas públicas y privadas |
| `src/front/pages/Home.jsx` | Catálogo público y compra autenticada |
| `src/front/pages/SignIn.jsx` | Login |
| `src/front/pages/SignUp.jsx` | Registro |
| `src/front/pages/Profile.jsx` | Vista privada del usuario |
| `src/front/pages/Orders.jsx` | Vista privada de órdenes |

## Patrones usados en el backend

### 1. Blueprint para agrupar la API

Toda la API vive en `src/api/routes.py` bajo el blueprint `api`, luego se registra en `src/app.py` con prefijo `/api`.

### 2. Password hashing en el modelo

El hash y la validación de contraseña se encapsulan en `User.set_password()` y `User.check_password()`. Esto evita repetir lógica de seguridad en cada endpoint.

### 3. JWT identity mínima

El token guarda solo el `user.id` como identidad. Después, el backend reconstruye el usuario real leyendo `get_jwt_identity()` y consultando la base de datos.

### 4. Scoping por usuario autenticado

Las órdenes no se consultan usando un `user_id` enviado por el cliente. El backend toma el usuario desde el JWT y filtra:

```python
orders = Order.query.filter_by(user_id=user.id).all()
```

Ese patrón evita que un usuario pueda pedir datos de otro usuario manipulando la request.

### 5. Snapshot de precio en `Order`

`Order.unit_price` guarda el precio del producto en el momento de la compra. Así, si el producto cambia de precio después, la orden mantiene el valor histórico.

### 6. Seed por CLI

La carga de datos vive en un comando Flask (`insert-test-data`) y no en código ad hoc. Esto hace el entorno reproducible y rápido de resetear.

## Patrones usados en el frontend

### 1. Reducer + Context para auth y datos compartidos

La sesión, productos, órdenes, errores y estados de carga viven en un store global basado en `useReducer`.

Esto centraliza cambios como:

- guardar sesión
- cerrar sesión
- persistir JWT
- cargar catálogo
- cargar órdenes
- manejar mensajes y errores

### 2. Persistencia en `localStorage`

Al iniciar la app se intenta reconstruir `token` y `user` desde `localStorage`. Después, `Layout.jsx` revalida esa sesión contra `/api/me`.

Esto permite:

- mantener la sesión entre recargas
- invalidarla correctamente si el token ya no sirve

### 3. `PrivateRoute`

El front usa un wrapper dedicado para separar:

- rutas públicas: `/`, `/sign-in`, `/sign-up`
- rutas privadas: `/profile`, `/orders`

Si no hay token válido, el usuario es redirigido automáticamente a `sign-in`.

### 4. Servicio `apiRequest`

En vez de repetir `fetch` manual en cada página, existe un wrapper en `src/front/services/api.js` que:

- construye la URL base
- añade headers consistentes
- parsea JSON
- lanza errores con mensaje usable

### 5. Home pública con acción autenticada

La home es pública, pero la compra real es un buen ejemplo de “acción protegida sobre vista pública”:

- cualquiera ve productos
- solo un usuario autenticado puede crear la orden

## Validaciones realizadas

Se validó el ejemplo con:

- `npm run lint`
- `npm run build`
- `python3 -m compileall src`
- `flask --app src/app.py db upgrade`
- `flask --app src/app.py insert-test-data`
- prueba end-to-end con `Flask test_client` sobre `products`, `sign-up`, `me`, `create order` y `orders`

## Ideas de exploración

- Añadir `logout` automático al expirar el token con manejo visual más explícito.
- Crear `DELETE /api/orders/:id` si quieres practicar ownership de recursos.
- Separar auth en un módulo propio si el proyecto crece.
- Añadir tests unitarios o de integración para el flujo JWT.
