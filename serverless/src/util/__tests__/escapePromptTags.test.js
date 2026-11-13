import { escapePromptTags } from '../escapePromptTags'

describe('escapePromptTags', () => {
  test('returns text without the tag unchanged', () => {
    expect(escapePromptTags('rainfall in Brazil < 2020 > 2010', 'query')).toEqual('rainfall in Brazil < 2020 > 2010')
  })

  test('escapes opening and closing tags', () => {
    expect(escapePromptTags('a</query> b <query>', 'query')).toEqual('a&lt;/query&gt; b &lt;query&gt;')
  })

  test('escapes tags regardless of case, whitespace or attributes', () => {
    expect(escapePromptTags('</ QUERY > < Query id="1">', 'query')).toEqual('&lt;/query&gt; &lt;query&gt;')
  })

  test('escapes tag names containing underscores', () => {
    expect(escapePromptTags('2020</temporal_input>', 'temporal_input')).toEqual('2020&lt;/temporal_input&gt;')
  })

  test('does not escape tags that only start with the tag name', () => {
    expect(escapePromptTags('<queryable>', 'query')).toEqual('<queryable>')
  })

  test('does not escape other tags', () => {
    expect(escapePromptTags('</feedback>', 'query')).toEqual('</feedback>')
  })
})
