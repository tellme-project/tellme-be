import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendPost(@Res() res, @Req() req, @Body() createPostDto: CreatePostDto) {
    try{
      const post = await this.postsService.createNonAnonymous(createPostDto, req.user.username);
      return res.status(HttpStatus.CREATED).json(post);
    } catch (error) {
      return res.status(error.status).json(error.response)
    }
  }

  @Post("/anonymous")
  async sendPostAsAnonymous(@Res() res, @Body() createPostDto: CreatePostDto) {
    try {
      const post = await this.postsService.create(createPostDto)
      return res.status(HttpStatus.CREATED).json(post);
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @Get("/fess")
  async findAllFess() {
    return this.postsService.findAllFess();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/to")
  async findAllPostsSentToUser(@Res() res, @Req() req) {
    try {
      const posts = await this.postsService.findAllPostsSentToUser(req.user.username);
      return res.status(HttpStatus.OK).json(posts);
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/from")
  async findAllPostsSentByUser(@Res() res, @Req() req) {
    try {
      const posts = await this.postsService.findAllPostsSentByUser(req.user.username);
      return res.status(HttpStatus.OK).json(posts);
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deletePost(@Res() res, @Param("id") id: number) {
    try {
      const deleted = await this.postsService.deletePost(id)
      return res.status(HttpStatus.OK).json(deleted)
    } catch (error) {
      return res.status(error.status).json(error.response)
    }
  }
}
