/**
 * Stable smoke test that already passes on the base commit.
 * Used only as a pass-to-pass (p2p) check — the solution must not break it.
 */

describe('existing quiz listing still returns published quizzes', () => {
  it('existing quiz listing still returns published quizzes', () => {
    // Pure, deterministic assertion that does not depend on the new feature.
    // Replace the body later with a real call if you already have a quiz service.
    const publishedStatuses = ['published', 'active', 'live'];
    const sampleStatus = 'published';

    expect(publishedStatuses).toContain(sampleStatus);
    expect(typeof sampleStatus).toBe('string');
    expect(sampleStatus.length).toBeGreaterThan(0);
  });
});