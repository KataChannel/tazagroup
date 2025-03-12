"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const path_1 = require("path");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use('/images', express.static((0, path_1.join)(__dirname, '../sandbox/images')));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('✅ Firebase initialized with Service Account from ENV');
    }
    else {
        console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON is missing!');
    }
    await app.listen(process.env.PORT ?? 3332);
}
bootstrap();
//# sourceMappingURL=main.js.map