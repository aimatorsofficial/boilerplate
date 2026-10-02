import { ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../../lib/app-error.js';
import { toSkip, type PaginationQuery } from '../../lib/pagination.js';
import type { UsersRepository } from '../../modules/users/users.repository.js';
import type { NewUserRecord, UpdateUserInput, User } from '../../modules/users/users.schema.js';
import { isDuplicateKeyError } from './mongo-errors.js';
import { UserModel, type UserDocument } from './users.model.js';

const NEWEST_FIRST = { createdAt: -1, _id: -1 } as const;
const UPDATE_OPTIONS = { returnDocument: 'after', runValidators: true } as const;

const toUser = (doc: Omit<UserDocument, 'passwordHash'>): User => ({
  id: doc._id,
  name: doc.name,
  email: doc.email,
  role: doc.role,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const toUserOrNull = (doc: UserDocument | null) => (doc ? toUser(doc) : null);

const rethrowDuplicateEmail = (error: unknown): never => {
  if (isDuplicateKeyError(error)) throw new AppError(ERROR_CODES.EMAIL_TAKEN);
  throw error;
};

export class MongoUsersRepository implements UsersRepository {
  async create(input: NewUserRecord) {
    try {
      const doc = await UserModel.create(input);
      return toUser(doc.toObject());
    } catch (error) {
      return rethrowDuplicateEmail(error);
    }
  }

  async findById(id: string) {
    return toUserOrNull(await UserModel.findById(id).lean<UserDocument>());
  }

  async findByEmail(email: string) {
    return toUserOrNull(await UserModel.findOne({ email }).lean<UserDocument>());
  }

  async findCredentialsByEmail(email: string) {
    const doc = await UserModel.findOne({ email }).select('+passwordHash').lean<UserDocument>();
    return doc ? { ...toUser(doc), passwordHash: doc.passwordHash } : null;
  }

  async list(query: PaginationQuery) {
    const [docs, total] = await Promise.all([
      UserModel.find()
        .sort(NEWEST_FIRST)
        .skip(toSkip(query))
        .limit(query.limit)
        .lean<UserDocument[]>(),
      UserModel.countDocuments(),
    ]);
    return { items: docs.map(toUser), total };
  }

  async update(id: string, input: UpdateUserInput) {
    try {
      const doc = await UserModel.findByIdAndUpdate(
        id,
        { $set: input },
        UPDATE_OPTIONS,
      ).lean<UserDocument>();
      return toUserOrNull(doc);
    } catch (error) {
      return rethrowDuplicateEmail(error);
    }
  }

  async delete(id: string) {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
