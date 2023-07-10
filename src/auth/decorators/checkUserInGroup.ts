import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { initializeApp } from 'firebase/app'
import { FirebaseConfig } from '../../config/firebase.config'
import { get, getDatabase, ref } from 'firebase/database'

@Injectable()
export class CheckUserInGroup implements CanActivate {
	private database;

	constructor(private jwtService: JwtService) {
		const app = initializeApp(FirebaseConfig);
		this.database = getDatabase(app);
	}

async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
        const authHeader = req.headers.authorization;
        const [bearer, token] = authHeader.split(' ');

        const user = this.jwtService.verify(token);
        req.user = user;

        const groupId = req.body.groupId || req.body.chatId || req.params.id;
				const groupRef = ref(this.database, `groups/${groupId}`);
				const groupSnapshot = await get(groupRef);
        const groupData = groupSnapshot.val();

			const userInGroup = groupData.users.some((groupUser: any) => groupUser.id === user.id);

			if (userInGroup) {
				return true;
			}
    } catch (e) {
			console.log(e)
        throw new UnauthorizedException("Unauthorized user");
    }
}
}
