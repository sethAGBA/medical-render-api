// src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Activer CORS
//   app.enableCors({
//     origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   // Activer la validation globale
//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(3000); // Le backend écoute sur le port 3000
// }
// bootstrap();




// // // src/main.ts

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Configuration Swagger
//   const config = new DocumentBuilder()
//     .setTitle('API Medical')
//     .setDescription('Documentation de l\'API Medical')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document);

//   // Configuration CORS
//   const allowedOrigins = [
//     'http://localhost:3000',
//     'http://localhost:19006',
//     'http://127.0.0.1:3000',
//     'https://medical-api.onrender.com',
//   ];

//   app.enableCors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//     allowedHeaders: [
//       'Content-Type',
//       'Accept',
//       'Authorization',
//       'Access-Control-Allow-Origin',
//     ],
//   });

//   // Validation globale
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true,
//     transformOptions: {
//       enableImplicitConversion: true,
//     },
//   }));

//   // Préfixe global pour l'API
//   app.setGlobalPrefix('api/v1');

//   // Configuration du port
//   const port = process.env.PORT || 3000;

//   // Démarrage du serveur
//   await app.listen(port, '0.0.0.0', () => {
//     console.log(`
//       🚀 Serveur démarré avec succès !
//       🌍 Mode: ${process.env.NODE_ENV || 'development'}
//       🔌 Port: ${port}
//       📚 Documentation: http://localhost:${port}/api/docs
//     `);
//   });
// }

// bootstrap().catch((error) => {
//   console.error('Erreur au démarrage du serveur:', error);
//   process.exit(1);
// });


// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  // Servir les fichiers statiques
  // app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  // Servir les fichiers statiques
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname, '..', 'Uploads'), {
    prefix: '/Uploads/',
  });


  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Medical')
    .setDescription('Documentation de l\'API Medical')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configuration CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:19006',
    'http://127.0.0.1:3000',
    'http://10.0.2.2:3000',
    // 'https://medical-api-t14f.onrender.com',
    'https://medical-render-api.onrender.com',
    'https://votre-domaine-frontend.com', // Remplacez par le domaine de votre frontend
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
  });

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Préfixe global pour l'API
  app.setGlobalPrefix('api/v1');

  // Configuration du port
  const port = process.env.PORT || 3000;

  // Démarrage du serveur
  await app.listen(port, '0.0.0.0', () => {
    console.log(`
      🚀 Serveur démarré avec succès !
      🌍 Mode: ${process.env.NODE_ENV || 'development'}
      🔌 Port: ${port}
      📚 Documentation: http://localhost:${port}/api/docs
    `);
  });
}

bootstrap().catch((error) => {
  console.error('Erreur au démarrage du serveur:', error);
  process.exit(1);
});