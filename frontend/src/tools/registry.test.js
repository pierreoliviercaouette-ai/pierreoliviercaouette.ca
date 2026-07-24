import { listToolSlugs, runTool } from './registry';
import { toolViews } from './views';

describe('tools registry UI mapping', () => {
  test('registers exactly 9 tools', () => {
    expect(listToolSlugs()).toHaveLength(9);
  });

  test.each(listToolSlugs())('%s produces rows and chart from defaults', (slug) => {
    const view = toolViews[slug];
    expect(view.fields.length).toBeGreaterThan(0);
    expect(view.defaults).toBeTruthy();
    const { results, presentation } = runTool(slug, view.defaults);
    expect(Object.keys(results).length).toBeGreaterThan(0);
    expect(presentation.rows.length).toBeGreaterThan(0);
    presentation.rows.forEach((row) => {
      expect(String(row.value)).not.toMatch(/NaN/);
    });
    expect(presentation.chart.type).toMatch(/stacked-line|bar|line/);
    expect(presentation.chart.data.length).toBeGreaterThan(0);
  });
});
