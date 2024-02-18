import { Email } from 'src/mail/domain/email';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

export abstract class MailRepository {
  abstract create(email: Omit<Email, 'id' | 'createdAt'>): Promise<Email>;
  abstract findOne(
    fields: EntityCondition<Email>,
  ): Promise<NullableType<Email>>;

  abstract update(
    id: Email['id'],
    payload: Partial<Email>,
  ): Promise<Email | null>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Email[]>;
}
