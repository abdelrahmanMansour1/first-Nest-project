import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherAddInput } from './input/teacher-add.input';
import { Logger } from '@nestjs/common';
import { TeacherEditInput } from './input/teacher-edit.input';
import { EntityWithId } from './school.types';
import { Subject } from './subject.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}
  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teachersRepository.find();
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Teacher> {
    return await this.teachersRepository.findOneOrFail({
      where: { id: id },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  public async add(
    @Args('input', { type: () => TeacherAddInput })
    input: TeacherAddInput,
  ): Promise<Teacher> {
    return await this.teachersRepository.save(new Teacher(input));
  }

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  public async edit(
    @Args('id', { type: () => Int }) id: number,
    @Args('input', { type: () => TeacherEditInput })
    input: TeacherEditInput,
  ): Promise<Teacher> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: { id },
    });
    return await this.teachersRepository.save(
      new Teacher(Object.assign(teacher, input)),
    );
  }

  @Mutation(() => EntityWithId, { name: 'teacherDelete' })
  public async delete(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EntityWithId> {
    await this.teachersRepository.findOneOrFail({
      where: { id },
    });

    await this.teachersRepository.delete(id);

    return new EntityWithId(id);
  }

  @ResolveField('subjects')
  public async subjects(@Parent() teacher: Teacher): Promise<Subject[]> {
    this.logger.debug('@ResolveField subjects was called!');
    return await teacher.subjects;
  }
}
