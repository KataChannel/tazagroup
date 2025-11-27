import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class LessonProgress {
  @Field(() => ID)
  id: string;

  @Field()
  enrollmentId: string;

  @Field()
  lessonId: string;

  @Field()
  completed: boolean;

  @Field(() => Int, { nullable: true })
  watchTime?: number;

  @Field(() => Float, { nullable: true })
  videoProgress?: number;

  @Field(() => Int, { nullable: true })
  timeSpent?: number;

  @Field({ nullable: true })
  lastWatchedAt?: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
