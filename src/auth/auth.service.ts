import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import db from 'src/database';
import { LoginDto } from './dto/login.dto';
import { sign } from 'jsonwebtoken';

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
        
        return await db.insertInto("User")
                .values({
                    username,
                    name,
                    password: hashedPassword
                })
                .returningAll()
                .execute();
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.getUser(username);

        if (!user) throw new NotFoundException(`Username ${username} does not exist`);

        const isPasswordTheSame = await this.comparePassword(password, user.password);

        if (!isPasswordTheSame) throw new BadRequestException("Invalid password");

        const expiresIn = "1h";
        const token = sign(
            { username: username, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn }
        );

        return { user, token };
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
