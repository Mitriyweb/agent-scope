import { getVersion } from '@/utils/version';

describe('getVersion', (): void => {
  it('should return a version string', (): void => {
    const version = getVersion();
    expect(typeof version).toBe('string');
  });

  it('should return a valid semantic version format', (): void => {
    const version = getVersion();
    const semverRegex = /^\d+\.\d+\.\d+$/;
    expect(semverRegex.test(version)).toBe(true);
  });
});
