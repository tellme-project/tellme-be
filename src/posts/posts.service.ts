import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import db from 'src/database';

@Injectable()
export class PostsService {
  async getUser(username: string) {
    const user = await db.selectFrom("User").where("User.username", "=", username).selectAll().executeTakeFirst()
    if (!user) {
      return false
    }
    return true;
  }

  async create(createPostDto: CreatePostDto) {
    const to = await this.getUser(createPostDto.to);
    if (!to) {throw new NotFoundException(`Username ${createPostDto.to} is not found`)}
    return await db.insertInto("Post")
            .values({
              content: createPostDto.content,
              from: null,
              to: createPostDto.to
            })
            .returningAll()
            .execute();
  }

  async createNonAnonymous(createPostDto: CreatePostDto, sender) {
    const { from, to } = createPostDto;
    const checkFrom = await this.getUser(from);
    if (!checkFrom) {throw new NotFoundException(`Username ${from} is not found`)}
    
    const checkTo = await this.getUser(to);
    if (!checkTo) {throw new NotFoundException(`Username ${to} is not found`)}

    if (from != null && from != sender) {
      throw new BadRequestException("You can't send post using other person's username")
    }

    if (from == to) {
      throw new BadRequestException("You can't send message to yourself")
    }

    return await db.insertInto("Post")
            .values({
              content: createPostDto.content,
              from: createPostDto.from,
              to: createPostDto.to
            })
            .returningAll()
            .execute();
  }

  async findAllFess() {
    return await db.selectFrom("Post")
            .where("Post.to", "is", null)
            .selectAll()
            .execute();
  }

  async findAllPostsSentToUser(username: string) {
    const isUserExist = await this.getUser(username);
    if (!isUserExist) throw new NotFoundException(`Username ${username} is not found`)
    return await db.selectFrom("Post")
            .where("Post.to", "=", username)
            .selectAll()
            .execute();
  }

  async findAllPostsSentByUser(username: string) {
    const isUserExist = await this.getUser(username);
    if (!isUserExist) throw new NotFoundException(`Username ${username} is not found`)
    return await db.selectFrom("Post")
            .where("Post.from", "=", username)
            .selectAll()
            .execute();
  }

  async deletePost(id: number){
    return await db.deleteFrom("Post").where("Post.id", "=", id).returningAll().executeTakeFirst();
  }
}
