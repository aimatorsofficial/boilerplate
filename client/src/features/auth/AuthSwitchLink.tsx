import { Link } from 'react-router';

interface AuthSwitchLinkProps {
  prompt: string;
  linkText: string;
  to: string;
}

export const AuthSwitchLink = ({ prompt, linkText, to }: AuthSwitchLinkProps) => (
  <p className="text-sm text-slate-600">
    {prompt}{' '}
    <Link to={to} className="font-medium text-slate-900 underline">
      {linkText}
    </Link>
  </p>
);
