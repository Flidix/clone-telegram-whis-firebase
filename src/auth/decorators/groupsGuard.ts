import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveGroupsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map(data => this.removeGroups(data)),
		);
	}

	private removeGroups(data: any): any {
		if (Array.isArray(data)) {
			return data.map(item => this.removeGroups(item));
		} else if (typeof data === 'object' && data !== null) {
			const newData = Object.assign({}, data);
			delete newData.groups;
			for (const key in newData) {
				newData[key] = this.removeGroups(newData[key]);
			}
			return newData;
		}
		return data;
	}


}
