
# NestJS API Boilerplate

A robust, scalable boilerplate for building RESTful APIs with [NestJS](https://nestjs.com), TypeORM, JWT authentication, Cloudinary file uploads, and more.

---

## Features

- **User Authentication** (JWT, refresh token)
- **Role-based Authorization**
- **Post CRUD** with caching
- **File Uploads** (Cloudinary integration)
- **Throttling & Rate Limiting**
- **Event System** (NestJS Events)
- **Caching** (in-memory)
- **Environment Configuration** via `.env`
- **DTO & Validation**
- **Logging & Middleware**
- **Extensible Module Structure**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nestjs-api-boilerplate.git
cd nestjs-api-boilerplate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` (see `.env.example` for all available keys):

```env
APP_NAME=nestjs-api
PORT=3000

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=nestjs_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the application

```bash
npm run start:dev
```

---

## Project Structure

```
src/
│
├── auth/                # Authentication & user management
│   ├── entities/
│   ├── guards/
│   ├── pipes/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── token.service.ts
│   └── ...
│
├── posts/               # Post CRUD & caching
│   ├── entities/
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── ...
│
├── file-upload/         # File upload & Cloudinary integration
│   ├── cloudinary/
│   ├── entities/
│   ├── file-upload.controller.ts
│   ├── file-upload.service.ts
│   └── ...
│
├── events/              # Event listeners
│   ├── listeners/
│   └── ...
│
├── common/              # Middleware, decorators, utils
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

## Main Modules

- **Auth:** Register, login, JWT, refresh token, profile, logout, guards, roles.
- **Posts:** CRUD, caching, DTO, validation, pagination.
- **File Upload:** Upload files to Cloudinary, delete files, store metadata.
- **Events:** Listen for user registration and other events.
- **Throttling:** Rate limit login attempts.
- **Caching:** In-memory cache for posts and queries.

---

## Usage

### Authentication

- `POST /auth/register` — Register new user
- `POST /auth/login` — Login and get JWT tokens
- `POST /auth/refresh-token` — Refresh JWT token
- `GET /auth/profile` — Get current user profile (JWT required)
- `POST /auth/logout` — Logout user (invalidate refresh token)

### Posts

- `GET /posts` — List posts (supports pagination, caching)
- `GET /posts/:id` — Get post by ID
- `POST /posts` — Create post (JWT required)
- `PUT /posts/:id` — Update post (JWT required)
- `DELETE /posts/:id` — Delete post (Admin only)

### File Upload

- `POST /file-upload` — Upload file (JWT required)
- `GET /file-upload` — List uploaded files
- `DELETE /file-upload/:id` — Delete file (Admin only)

---

## Cloudinary Integration

- Configure your Cloudinary credentials in `.env`.
- Uploaded files are stored in your Cloudinary account.

---

## Development

- **Hot reload:** `npm run start:dev`
- **Lint:** `npm run lint`
- **Build:** `npm run build`
- **Test:** `npm run test`

---

## Environment Variables

See `.env.example` for all available configuration options.

---

## License

MIT

---

## Author

Built by STN.

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
