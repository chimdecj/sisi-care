import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inHomeCareServices } from '../lib/content';
import {
  absoluteUrl,
  businessId,
  organizationGraph,
  pageGraph,
  pageMetadata,
  publicPages,
  serializeJsonLd,
} from '../lib/seo';

test('every original page has unique canonical metadata on the confirmed domain', () => {
  assert.deepEqual(
    publicPages.map((page) => page.path),
    ['/', '/in-home-care/', '/about/', '/careers/', '/contact/'],
  );
  const canonicals = new Set();
  const titles = new Set();
  for (const page of publicPages) {
    const metadata = pageMetadata(page.path);
    assert.equal(metadata.alternates?.canonical, `https://sisicarewa.com${page.path}`);
    assert.equal(metadata.openGraph?.url, metadata.alternates?.canonical);
    assert.ok(page.path.endsWith('/'));
    assert.ok(page.description.length > 50);
    canonicals.add(metadata.alternates?.canonical);
    titles.add(JSON.stringify(metadata.title));
    assert.equal(pageGraph(page.path).url, metadata.alternates?.canonical);
    assert.equal(pageGraph(page.path).about['@id'], businessId);
  }
  assert.equal(canonicals.size, publicPages.length);
  assert.equal(titles.size, publicPages.length);
  assert.throws(() => pageMetadata('/unknown/'));
  for (const path of ['https://example.com/', '//example.com/'])
    assert.throws(() => absoluteUrl(path));
});

test('business service data links only to existing service sections', () => {
  const provider = organizationGraph()['@graph'].find((item) => item['@type'] === 'LocalBusiness');
  assert.ok(provider?.hasOfferCatalog);
  const anchors = inHomeCareServices.flatMap((item) => [item.id, ...item.aliases]);
  assert.equal(provider.hasOfferCatalog.itemListElement.length, 6);
  for (const offer of provider.hasOfferCatalog.itemListElement) {
    const url = new URL(offer.itemOffered.url);
    assert.equal(url.origin, 'https://sisicarewa.com');
    assert.equal(url.pathname, '/in-home-care/');
    assert.ok(anchors.includes(url.hash.slice(1)));
    assert.equal(offer.itemOffered.provider['@id'], provider['@id']);
  }
});

test('JSON-LD escapes script delimiters while preserving content', () => {
  const data = { text: '</script><script>alert("x")</script>' };
  const output = serializeJsonLd(data);
  assert.ok(!output.includes('<'));
  assert.deepEqual(JSON.parse(output), data);
});
