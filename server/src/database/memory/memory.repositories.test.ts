import { describeRefreshTokensRepositoryContract } from '../contracts/refresh-tokens.repository.contract.js';
import { describeUsersRepositoryContract } from '../contracts/users.repository.contract.js';
import { MemoryRefreshTokensRepository } from './refresh-tokens.memory.js';
import { MemoryUsersRepository } from './users.memory.js';

describeUsersRepositoryContract('memory', async () => new MemoryUsersRepository());

describeRefreshTokensRepositoryContract('memory', async () => new MemoryRefreshTokensRepository());
