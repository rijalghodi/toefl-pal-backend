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

import { CreateQuestionFullDto } from './dto/create-question-full.dto';
import { UpdateQuestionFullDto } from './dto/update-question-full.dto';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

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
@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('form/:formId/part/:partId/question')
  async create(
    @Param('formId') formId: string,
    @Param('partId') partId: string,
    @Body() dto: CreateQuestionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { audio } = this.extractAudioFiles(files);
    const result = await this.questionService.createQuestionAndDefault(
      formId,
      partId,
      dto,
      audio,
    );
    console.log(result, 'res');
    return new ResponseDto('success', result);
  }

  @Get('form/:formId/part/:partId/question')
  async findAllInPart(
    @Param('formId') formId: string,
    @Param('partId') partId: string,
  ) {
    const questions = await this.questionService.findAllInPart(formId, partId);
    return new ResponseDto('success', questions);
  }

  @Get('question/:questionId')
  async findOne(@Param('questionId') questionId: string) {
    const question = await this.questionService.findOne(questionId);
    return new ResponseDto('success', question);
  }

  @Patch('question/:questionId')
  async update(
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionFullDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { audio } = this.extractAudioFiles(files);
    const question = await this.questionService.updateFull(
      questionId,
      dto,
      audio,
    );
    return new ResponseDto('success', question);
  }

  @Delete('question/:questionId')
  async remove(@Param('questionId') id: string) {
    await this.questionService.remove(id);
    return new ResponseDto('success', null);
  }

  private extractAudioFiles(files: Express.Multer.File[]) {
    const audio = files.find((file) => file.fieldname === 'audio');
    return { audio };
  }
}
