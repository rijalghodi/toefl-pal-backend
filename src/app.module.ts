import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guard/auth.guard';
import { RoleGuard } from './common/guard/role.guard';
import { CaseSerializeInterceptor } from './common/interceptor/case-serializer.interceptor';
import datasource from './database/datasource';
import { FormModule } from './form/form.module';
import { OptionModule } from './option/option.module';
import { PartModule } from './part/part.module';
import { QuestionModule } from './question/question.module';
import { ReferenceModule } from './reference/reference.module';
import { StorageModule } from './storage/storage.module';
import { ToeflModule } from './toefl/toefl.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...datasource.options }),
    AuthModule,
    UserModule,
    ToeflModule,
    FormModule,
    StorageModule,
    PartModule,
    QuestionModule,
    ReferenceModule,
    OptionModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CaseSerializeInterceptor,
    },
  ],
})
export class AppModule {}
