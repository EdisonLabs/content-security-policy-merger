[![Testing](https://github.com/EdisonLabs/content-security-policy-merger/actions/workflows/testing.yml/badge.svg)](https://github.com/EdisonLabs/content-security-policy-merger/actions/workflows/testing.yml)

# Content Security Policy merger

Merge two Content-Security-Policy strings together.

Usage:

```javascript
import { merge } from 'content-security-policy-merger'

const cspA =
  "default-src 'self' *.example.com example.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' www.youtube.com; frame-src 'self' players.brightcove.net; img-src 'blob' 'self'; style-src 'unsafe-inline' https:"

const cspB =
  "default-src 'self' *.mysite.com mysite.com; script-src 'self' www.google-analytics.com; frame-src 'self' example.com; manifest-src 'self'; style-src 'unsafe-inline'"

merge(cspA, cspB)

// default-src 'self' *.example.com *.mysite.com example.com mysite.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' www.google-analytics.com www.youtube.com; frame-src 'self' example.com players.brightcove.net; img-src 'blob' 'self'; style-src 'unsafe-inline' https:; manifest-src 'self'
```

Related projects:

- [content-security-policy-parser](https://github.com/helmetjs/content-security-policy-parser)
