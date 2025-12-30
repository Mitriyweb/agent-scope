import { OpenSpecDetector } from '@/utils/OpenSpecDetector';
import { execSync } from 'child_process';

jest.mock('child_process');

describe('OpenSpecDetector', () => {
  const mockedExecSync = execSync as jest.MockedFunction<typeof execSync>;
  let detector: OpenSpecDetector;

  beforeEach(() => {
    detector = new OpenSpecDetector();
    jest.clearAllMocks();
  });

  describe('isInstalled', () => {
    it('should return true when openspec is installed', () => {
      mockedExecSync.mockReturnValue(Buffer.from('/usr/local/bin/openspec'));

      const result = detector.isInstalled();

      expect(result).toBe(true);
      expect(mockedExecSync).toHaveBeenCalledWith('which openspec', { stdio: 'pipe' });
    });

    it('should return false when openspec is not installed', () => {
      mockedExecSync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      const result = detector.isInstalled();

      expect(result).toBe(false);
    });
  });

  describe('getVersion', () => {
    it('should return version when openspec is installed', () => {
      mockedExecSync.mockReturnValue('1.0.0\n' as unknown as Buffer);

      const result = detector.getVersion();

      expect(result).toBe('1.0.0');
      expect(mockedExecSync).toHaveBeenCalledWith('openspec --version', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    });

    it('should return null when openspec is not installed', () => {
      mockedExecSync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      const result = detector.getVersion();

      expect(result).toBeNull();
    });
  });

  describe('getWarningMessage', () => {
    it('should return warning message', () => {
      const result = detector.getWarningMessage();

      expect(result).toContain('Warning: openspec CLI not found');
      expect(result).toContain('npm install -g openspec');
    });
  });

  describe('detect', () => {
    it('should return complete result when openspec is installed', () => {
      mockedExecSync
        .mockReturnValueOnce(Buffer.from('/usr/local/bin/openspec'))
        .mockReturnValueOnce('1.0.0\n' as unknown as Buffer);

      const result = detector.detect();

      expect(result.installed).toBe(true);
      expect(result.version).toBe('1.0.0');
      expect(result.warningMessage).toBeNull();
    });

    it('should return complete result when openspec is not installed', () => {
      mockedExecSync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      const result = detector.detect();

      expect(result.installed).toBe(false);
      expect(result.version).toBeNull();
      expect(result.warningMessage).toContain('Warning: openspec CLI not found');
    });
  });
});
