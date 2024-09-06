import { Injectable } from '@nestjs/common';

import { UpdateFormDto } from '@/form/dto/update-form.dto';
import { FormService } from '@/form/form.service';

import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(private readonly formService: FormService) {}

  async findOneSection(sectionId: string) {
    const section = await this.formService.findOneForm(sectionId);
    return section;
  }

  async createSection(name: string, duration: number) {
    const section = await this.formService.createForm({
      name,
      duration,
      allowRewind: false,
      autoPlay: true,
      description: '',
    });

    const sectionVersion = await this.formService.createFormVersion(section.id);

    return [section, sectionVersion];
  }

  async updateSection(sectionId: string, data: UpdateFormDto) {
    return this.formService.updateForm(sectionId, data);
  }

  async updateSectionVersion(sectionId: string, data: UpdateSectionDto) {
    return this.formService.updateForm(sectionId, data);
  }

  async createSectionVersion(sectionId: string) {
    return await this.formService.createFormVersion(sectionId);
  }
}
