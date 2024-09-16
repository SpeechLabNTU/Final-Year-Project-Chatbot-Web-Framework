import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topic/topic.module';
import { IntentModule } from './intent/intent.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TopicModule,
    IntentModule,
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
          dbName: 'intent-management',
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        };
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
