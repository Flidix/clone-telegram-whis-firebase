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
			// If the data is an array, remove 'groups' from each item
			return data.map(item => this.removeGroups(item));
		} else if (typeof data === 'object' && data !== null) {
			// If the data is an object, remove 'groups' property recursively
			for (const key in data) {
				if (key === 'groups') {
					delete data[key];
				} else if (typeof data[key] === 'object') {
					data[key] = this.removeGroups(data[key]);
				}
			}
		}
		return data;
	}

}
