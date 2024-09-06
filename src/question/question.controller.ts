import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { ResponseDto } from '@/common/dto/response.dto';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';

@UseInterceptors(
  AnyFilesInterceptor({
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('audio/')) {
        return callback(
          new BadRequestException('Only audio files are allowed'),
          false,
        );
      }
      callback(null, true);
    },
  }),
)
@Controller('form/:formId/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(
    @Param('formId') formId: string,
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { audio } = this.extractAudioFiles(files);
    const question = await this.questionService.create(
      formId,
      createQuestionDto,
      audio,
    );
    return new ResponseDto('success', question);
  }

  @Get()
  async findAll(@Param('formId') formId: string) {
    const questions = await this.questionService.findAll(formId);
    return new ResponseDto('success', questions);
  }

  @Get(':questionId')
  async findOne(@Param('questionId') questionId: string) {
    const question = await this.questionService.findOne(questionId);
    return new ResponseDto('success', question);
  }

  @Patch(':questionId')
  async update(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { audio } = this.extractAudioFiles(files);
    const question = await this.questionService.update(
      questionId,
      updateQuestionDto,
      audio,
    );
    return new ResponseDto('success', question);
  }

  @Delete(':questionId')
  async remove(@Param('questionId') id: string) {
    await this.questionService.remove(id);
    return new ResponseDto('success', null);
  }

  private extractAudioFiles(files: Express.Multer.File[]) {
    const audio = files.find((file) => file.fieldname === 'audio');
    return { audio };
  }
}
