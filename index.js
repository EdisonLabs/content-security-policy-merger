import parse from 'content-security-policy-parser'

/**
 * Remove duplicated values from an array.
 *
 * @param array The array to be handled.
 * @returns {*} The array without duplicated values.
 */
function arrayUnique(array) {
  const a = array.concat()
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1)
    }
  }

  return a
}

/**
 * Merges two Content-Security-Policy directives.
 *
 * @param {string|Object} csp1 The first CSP directives list.
 * @param {string|Object} csp2 The second CSP directives list.
 * @returns {string} The string of the merged Content-Security-Policy header.
 */
function merge(csp1, csp2) {
  if (typeof csp1 === 'string') {
    csp1 = parse(csp1)
  }

  if (typeof csp2 === 'string') {
    csp2 = parse(csp2)
  }

  const csp = {}

  // Sets a list of CSP directives from csp1 and csp2 list.
  const cspDirectives = arrayUnique(Object.keys(csp1).concat(Object.keys(csp2)))

  // Merges directives.
  cspDirectives.forEach(function (directive) {
    csp[directive] = []
    if (typeof csp2[directive] !== 'undefined') {
      csp[directive] = csp2[directive]
    }
    if (typeof csp1[directive] !== 'undefined') {
      csp[directive] = arrayUnique(csp[directive].concat(csp1[directive]))
    }

    csp[directive] = csp[directive].sort()
  })

  // Generates CSP header string.
  let cspString = ''
  Object.keys(csp).map(
    (directive) =>
      (cspString += directive + ' ' + csp[directive].join(' ') + '; '),
  )

  return cspString.trim().replace(/;*$/, '')
}

export { merge }
