import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('links the label to the input', () => {
    render(<TextField label="Email" />);

    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement);
  });

  it('marks the input invalid and describes it with the error', () => {
    render(<TextField label="Email" error="Required" />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required');
  });

  it('shows a hint without marking the input invalid', () => {
    render(<TextField label="Password" hint="At least 8" />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAccessibleDescription('At least 8');
  });
});
