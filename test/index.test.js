import { merge } from './dist/index'
import parse from 'content-security-policy-parser'

const cspA = "default-src 'self' *.example.com example.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' www.youtube.com; frame-src 'self' players.brightcove.net; img-src 'blob' 'self'; style-src 'unsafe-inline' https:"
const cspB = "default-src 'self' *.mysite.com mysite.com; script-src 'self' www.google-analytics.com; frame-src 'self' example.com; manifest-src 'self'; style-src 'unsafe-inline'"
const cspMerged = "default-src 'self' *.example.com *.mysite.com example.com mysite.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' www.google-analytics.com www.youtube.com; frame-src 'self' example.com players.brightcove.net; img-src 'blob' 'self'; style-src 'unsafe-inline' https:; manifest-src 'self'"

test('merge directives when CSP (A) is empty & (B) is string', async () => {
  expect(merge('', cspB)).toBe(cspB)
  expect(merge({}, cspB)).toBe(cspB)
})

test('merge directives when CSP (A) is string & (B) is empty', async () => {
  expect(merge(cspA, '')).toBe(cspA)
  expect(merge(cspA, {})).toBe(cspA)
})

test('merge directives when CSP (A) is string & (B) is object', async () => {
  const cspObj = parse(cspB)
  expect(merge(cspA, cspObj)).toBe(cspMerged)
})

test('merge directives when CSP (A) is object & (B) is string', async () => {
  const cspObj = parse(cspA)
  expect(merge(cspObj, cspB)).toBe(cspMerged)
})

test('merge directives when CSP (A) is object & (B) is object', async () => {
  const cspObjA = parse(cspA)
  const cspObjB = parse(cspB)
  expect(merge(cspObjA, cspObjB)).toBe(cspMerged)
})

test('merge directives when CSP (A) and (B) have duplicated directives', async () => {
  expect(merge("default-src 'self'", "default-src 'self'")).toBe("default-src 'self'")
})

test('merge directives when CSP (A) has directives not present in (B)', async () => {
  expect(merge("frame-src 'self'", "default-src 'self'")).toBe("frame-src 'self'; default-src 'self'")
})

test('merge directives when CSP (A) has NOT directives present in (B)', async () => {
  expect(merge("default-src 'self'", "frame-src 'self'")).toBe("default-src 'self'; frame-src 'self'")
})

test('merged directives is not ending with comma', async () => {
  const csp = merge(cspA, cspB)
  expect(csp).toBe(cspMerged)

  const lastChar = csp.slice(-1);
  expect(lastChar).not.toBe(';')
})
