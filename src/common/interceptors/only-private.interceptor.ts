import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { userExceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class OnlyPrivateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.user) return next.handle().pipe(map((data) => data));
    else throw new UnauthorizedException(userExceptionMessage.UNAUTHORIZED);
  }
}
