import { render, screen } from '@testing-library/react';
import SummarizerPage from '../app/dashboard/summarizer/page';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => ({
  Youtube: () => <div data-testid="youtube-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  List: () => <div data-testid="list-icon" />,
  FileText: () => <div data-testid="filetext-icon" />,
  Network: () => <div data-testid="network-icon" />,
}));

jest.mock('../app/dashboard/summarizer/actions', () => ({
  saveSummaryAsNote: jest.fn(),
}));

jest.mock('react-markdown', () => ({ children }: { children: React.ReactNode }) => <div data-testid="react-markdown">{children}</div>);
jest.mock('remark-gfm', () => () => {});
jest.mock('../components/ui/Mermaid', () => () => <div data-testid="mermaid-chart" />);

describe('SummarizerPage', () => {
  it('renders the summarizer form and elements correctly', () => {
    render(<SummarizerPage />);
    expect(screen.getByText('YT Pulse')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://www.youtube.com/watch?v=...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze/i })).toBeInTheDocument();
  });
});
