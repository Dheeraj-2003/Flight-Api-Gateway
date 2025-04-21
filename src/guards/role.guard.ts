import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { ROLE } from "src/common/role.enum";

export class RoleGuard implements CanActivate{
    constructor(private requiredRole: ROLE){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const req =context.switchToHttp().getRequest();
        const user = req.user;

        if(req.user.role != this.requiredRole) {
            throw new ForbiddenException('Insufficient role');
        }
        return true;
    }
    

}