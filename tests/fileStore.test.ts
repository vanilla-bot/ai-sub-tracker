import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  loadPlans,
  savePlans,
  loadUsageEntries,
  saveUsageEntries,
} from '../src/store/fileStore';
import type { Plan, UsageEntry } from '../src/models/plan';

describe('fileStore', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'fileStore-test-'));
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  const testPlan: Plan = {
    id: 'plan-1',
    name: 'Pro Plan',
    provider: 'cloud_code',
    period: 'monthly',
    price: 29.99,
    currency: 'USD',
    maxTokens: 100000,
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  };

  const testUsageEntry: UsageEntry = {
    id: 'usage-1',
    planId: 'plan-1',
    date: '2026-04-01',
    tokens: 5000,
    periodStart: '2026-04-01',
    periodEnd: '2026-04-30',
  };

  describe('loadPlans', () => {
    it('should load plans from a JSON file', async () => {
      const plansFile = path.join(tempDir, 'plans.json');
      await fs.promises.writeFile(
        plansFile,
        JSON.stringify([testPlan])
      );

      const plans = await loadPlans(plansFile);
      expect(plans).toHaveLength(1);
      expect(plans[0]).toEqual(testPlan);
    });

    it('should return empty array for non-existent file', async () => {
      const plans = await loadPlans(path.join(tempDir, 'nonexistent.json'));
      expect(plans).toHaveLength(0);
    });

    it('should throw error for invalid JSON', async () => {
      const plansFile = path.join(tempDir, 'plans.json');
      await fs.promises.writeFile(plansFile, 'not valid json');

      await expect(loadPlans(plansFile)).rejects.toThrow();
    });
  });

  describe('savePlans', () => {
    it('should save plans to a JSON file', async () => {
      const plansFile = path.join(tempDir, 'plans.json');
      await savePlans(plansFile, [testPlan]);

      const content = await fs.promises.readFile(plansFile, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(testPlan);
    });

    it('should overwrite existing file', async () => {
      const plansFile = path.join(tempDir, 'plans.json');
      await fs.promises.writeFile(
        plansFile,
        JSON.stringify([{ ...testPlan, id: 'old-id' }])
      );

      await savePlans(plansFile, [testPlan]);

      const content = await fs.promises.readFile(plansFile, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('plan-1');
    });
  });

  describe('loadUsageEntries', () => {
    it('should load usage entries from a JSON file', async () => {
      const usageFile = path.join(tempDir, 'usage.json');
      await fs.promises.writeFile(
        usageFile,
        JSON.stringify([testUsageEntry])
      );

      const entries = await loadUsageEntries(usageFile);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual(testUsageEntry);
    });

    it('should return empty array for non-existent file', async () => {
      const entries = await loadUsageEntries(
        path.join(tempDir, 'nonexistent.json')
      );
      expect(entries).toHaveLength(0);
    });
  });

  describe('saveUsageEntries', () => {
    it('should save usage entries to a JSON file', async () => {
      const usageFile = path.join(tempDir, 'usage.json');
      await saveUsageEntries(usageFile, [testUsageEntry]);

      const content = await fs.promises.readFile(usageFile, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(testUsageEntry);
    });
  });
});