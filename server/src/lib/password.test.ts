import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('password hashing', () => {
  it('never returns the plain password', async () => {
    const passwordHash = await hashPassword('correct horse');

    expect(passwordHash).not.toContain('correct horse');
    expect(passwordHash).toMatch(/^\$argon2id\$/);
  });

  it('accepts the right password and rejects a wrong one', async () => {
    const passwordHash = await hashPassword('correct horse');

    expect(await verifyPassword(passwordHash, 'correct horse')).toBe(true);
    expect(await verifyPassword(passwordHash, 'wrong horse')).toBe(false);
  });
});
