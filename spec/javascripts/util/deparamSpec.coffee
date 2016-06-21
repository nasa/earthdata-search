

describe 'deparam', ->
  fn = window.edsc.util.deparam

  deparam = (name, input, output, reviver) ->
    it name, ->
      expect(fn(input, reviver)).toEqual(output)

  reviver = (name, input, output) ->
    it name, ->
      expect(fn.reviver('key', input)).toEqual(output)

  deparam 'deserializes empty strings', '', {}
  deparam 'copies all params to the result', 'a=x&b=y&c=z', {a: 'x', b: 'y', c: 'z'}
  deparam 'implicitly pushes repeated params', 'a=x&a=y&a=z', {a: ['x', 'y', 'z']}
  deparam 'creates arrays using array syntax', 'a[]=x&a[]=y&a[]=z', {a: ['x', 'y', 'z']}
  deparam 'creates arrays using array with index syntax', 'a[0]=x&a[1]=y&a[2]=z', {a: ['x', 'y', 'z']}
  deparam 'allows skipping indexes in arrays', 'a[0]=x&a[2]=z', {a: ['x', undefined, 'z']}
  deparam 'creates nested arrays', 'a[][]=x', {a: [['x']]}
  deparam 'creates multiple arrays when indices are ambiguous', 'a[][]=x&a[][]=y&a[][]=z', {a: [['x'], ['y'], ['z']]}
  deparam 'creates arrays when indices are unambiguous', 'a[0][]=x&a[1][]=y&a[2][]=z', {a: [['x'], ['y'], ['z']]}
  deparam 'creates child arrays when indices are repeated', 'a[0][]=x&a[0][]=y&a[0][]=z', {a: [['x', 'y', 'z']]}
  deparam 'creates deep arrays', 'a[0][]=s&a[0][][]=t&a[1][][]=u&a[1][]=v&a[2][][]=w&a[2][]=x&a[2][][]=y&a[3][][][]=z', {a: [['s',['t']], [['u'],'v'], [['w'],'x',['y']], [[['z']]]]}
  deparam 'creates nested objects', 'a[b]=x', {a: {b: 'x'}}
  deparam 'creates nested objects with multiple properties', 'a[b]=x&a[c]=y', {a: {b: 'x', c: 'y'}}
  deparam 'allows deep nesting', 'a[b][c]=x', {a: {b: {c: 'x'}}}
  deparam 'creates objects containing arrays', 'a[b][]=x&a[b][]=y', {a: {b: ['x', 'y']}}
  deparam 'creates objects containing implicit arrays containing objects', 'a[][b]=x&a[][c]=y', {a: [{b: 'x'}, {c: 'y'}]}
  deparam 'creates objects containing explicit arrays containing objects', 'a[b][0]=x&a[b][2]=z', {a: {b: ['x', undefined, 'z']}}
  deparam 'allows mixing explicit and implicit array indices in created objects', 'a[b][0][]=x&a[b][0][]=y', {a: {b: [['x', 'y']]}}

  deparam 'decodes urls', 'a=x%3Ay', {a: 'x:y'}
  deparam 'replaces plus with space', 'a=x+y', {a: 'x y'}
  deparam 'deserializes strings by default', 'a=str', {a: 'str'}
  deparam 'deserializes empty strings', 'a=', {a: ''}
  deparam 'parses valid positive integers', 'a=1234', {a: 1234}
  deparam 'parses valid negative integers', 'a=-1234', {a: -1234}
  deparam 'parses valid positive floats', 'a=12.34', {a: 12.34}
  deparam 'parses valid negative floats', 'a=-12.34', {a: -12.34}
  deparam 'parses zero', 'a=0', {a: 0}
  deparam 'does not parse octal numbers', 'a=01234', {a: '01234'}
  deparam 'does not parse hex numbers', 'a=0x1234', {a: '0x1234'}
  deparam 'does not parse exponential numbers', 'a=1e3', {a: '1e3'}
  deparam 'does not parse invalid numbers', 'a=-0', {a: '-0'}
  deparam 'parses boolean true', 'a=true', {a: true}
  deparam 'parses boolean false', 'a=false', {a: false}
  deparam 'parses null', 'a=null', {a: null}
  deparam 'parses undefined', 'a=undefined', {a: undefined}

  deparam 'allows custom revivers', "a=x", {a: '(a=x)'}, (key, value) -> "(#{key}=#{value})"

  reviver 'does not decode urls', 'x%3Ay', 'x%3Ay'
  reviver 'does not replace pluses', 'x+y', 'x+y'
  reviver 'deserializes strings by default', 'str', 'str'
  reviver 'deserializes empty strings', '', ''
  reviver 'parses valid positive integers', '1234', 1234
  reviver 'parses valid negative integers', '-1234', -1234
  reviver 'parses valid positive floats', '12.34', 12.34
  reviver 'parses valid negative floats', '-12.34', -12.34
  reviver 'parses zero', '0', 0
  reviver 'does not parse octal numbers', '01234', '01234'
  reviver 'does not parse hex numbers', '0x1234', '0x1234'
  reviver 'does not parse exponential numbers', '1e3', '1e3'
  reviver 'does not parse invalid numbers', '-0', '-0'
  reviver 'parses boolean true', 'true', true
  reviver 'parses boolean false', 'false', false
  reviver 'parses null', 'null', null
  reviver 'parses undefined', 'undefined', undefined
