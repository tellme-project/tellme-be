import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import db from 'src/database';

@Injectable()
export class AuthService {
    async getUser(username: string) {
        return await db.selectFrom("User")
            .where("username", "=", username)
            .selectAll()
            .executeTakeFirst();
    }

    async register(registerDto: RegisterDto) {
        const { username, name, password } = registerDto;
        const hashedPassword = await this.hashPassword(password);
        
        if (await this.getUser(username)) throw new BadRequestException("Username is used");
        
        return db.insertInto("User")
                .values({
                    username,
                    name,
                    password: hashedPassword
                })
                .returningAll()
                .execute();
    }

    async hashPassword(plainText: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(plainText, salt);
        return hashPassword;
      }
    
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
      }
}
