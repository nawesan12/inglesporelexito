This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## CRM End-to-End

Además de la landing principal (`/`), la aplicación ahora incluye un panel CRM completo disponible en [`/crm`](http://localhost:3000/crm). Desde allí podés:

- Registrar y editar leads o estudiantes potenciales.
- Gestionar el pipeline de oportunidades con etapas configurables.
- Crear tareas de seguimiento vinculadas a contactos y deals.
- Visualizar métricas clave del pipeline y recordatorios pendientes.

### Configuración de la base de datos

El CRM utiliza Prisma y PostgreSQL. Antes de levantar el proyecto asegurate de:

1. Definir la variable de entorno `DATABASE_URL` con la cadena de conexión a tu base de datos PostgreSQL.
2. Ejecutar las migraciones y generar el cliente de Prisma:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

Con eso ya vas a poder crear, consultar y actualizar datos reales desde el panel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
