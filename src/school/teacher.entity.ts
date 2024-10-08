import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from './subject.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Gender } from './school.types';
import { Course } from './course.entity';

@Entity()
@ObjectType()
export class Teacher {
  constructor(partial?: Partial<Teacher>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
  })
  @Field()
  gender: Gender;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject])
  subjects: Promise<Subject[]>;

  @OneToMany(() => Course, (course) => course.teacher)
  @Field(() => [Course])
  courses: Promise<Course[]>;
}
