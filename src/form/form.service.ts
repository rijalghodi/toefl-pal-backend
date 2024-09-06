import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entity/form.entity';
import { FormVersion } from './entity/form-version.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepo: Repository<Form>,
    @InjectRepository(FormVersion)
    private readonly formVersionRepo: Repository<FormVersion>,
  ) {}

  async findOneForm(
    formId?: string,
  ): Promise<Omit<Form, 'setId'> & { version: FormVersion[] }> {
    const form = await this.formRepo.findOne({ where: { id: formId } });
    const version = await this.findAllFormVersion(formId);
    return { ...form, version };
  }

  async findAllFormVersion(formId: string): Promise<FormVersion[]> {
    return this.formVersionRepo.find({
      where: { form: { id: formId } },
      order: { createdAt: 'DESC' },
    });
  }

  async createForm(data: CreateFormDto): Promise<Form> {
    const form = await this.formRepo.save(this.formRepo.create(data));
    await this.formVersionRepo.save(this.formVersionRepo.create({ form }));
    return form;
  }

  async updateForm(
    formId: string,
    data: Partial<UpdateFormDto>,
  ): Promise<Form> {
    const form = await this.findOneForm(formId);

    if (!form) {
      throw new NotFoundException(`Form with id ${formId} not found`);
    }

    const newForm = Object.assign(form, data);
    return this.formRepo.save(newForm);
  }

  async createFormVersion(formId: string): Promise<FormVersion> {
    const form = await this.formRepo.findOne({ where: { id: formId } });
    const formVersion = this.formVersionRepo.create({ form });
    return this.formVersionRepo.save(formVersion);
  }

  // form version rarely updated
  // async updateFormVersion() {}

  async findLatestFormVersion(formId: string): Promise<FormVersion> {
    return this.formVersionRepo.findOne({
      where: { id: formId },
      order: { createdAt: 'DESC' },
    });
  }
}
