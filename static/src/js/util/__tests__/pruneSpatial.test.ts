import { type DataWithSpatial, pruneSpatial } from '../pruneSpatial'

describe('pruneSpatial', () => {
  test('removes empty spatial fields', () => {
    const input = {
      boundingBox: [],
      circle: [],
      line: [],
      point: [],
      polygon: []
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      boundingBox: undefined,
      circle: undefined,
      line: undefined,
      point: undefined,
      polygon: undefined
    })
  })

  test('keeps non-spatial fields', () => {
    const input = {
      id: '1',
      name: 'Test',
      description: 'Test description',
      boundingBox: [],
      circle: [],
      line: [],
      point: [],
      polygon: []
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      id: '1',
      name: 'Test',
      description: 'Test description',
      boundingBox: undefined,
      circle: undefined,
      line: undefined,
      point: undefined,
      polygon: undefined
    })
  })

  test('keeps non-empty boundingBox field', () => {
    const input = {
      boundingBox: ['-18.28125,-25.8845,-10.40625,-14.07468'],
      circle: [],
      line: [],
      point: [],
      polygon: []
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      boundingBox: ['-18.28125,-25.8845,-10.40625,-14.07468'],
      circle: undefined,
      line: undefined,
      point: undefined,
      polygon: undefined
    })
  })

  test('keeps non-empty circle field', () => {
    const input = {
      boundingBox: [],
      circle: ['-77, 34, 20000'],
      line: [],
      point: [],
      polygon: []
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      boundingBox: undefined,
      circle: ['-77, 34, 20000'],
      line: undefined,
      point: undefined,
      polygon: undefined
    })
  })

  test('keeps non-empty line field', () => {
    const input = {
      boundingBox: [],
      circle: [],
      line: ['82.6875,-18.61541,83.1231,-16.11311'],
      point: [],
      polygon: []
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      boundingBox: undefined,
      circle: undefined,
      line: ['82.6875,-18.61541,83.1231,-16.11311'],
      point: undefined,
      polygon: undefined
    })
  })

  test('keeps non-empty point field', () => {
    const input = {
      boundingBox: [],
      circle: [],
      line: [],
      point: ['82.6875,-18.61541'],
      polygon: []
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      boundingBox: undefined,
      circle: undefined,
      line: undefined,
      point: ['82.6875,-18.61541'],
      polygon: undefined
    })
  })

  test('keeps non-empty polygon field', () => {
    const input = {
      boundingBox: [],
      circle: [],
      line: [],
      point: [],
      polygon: ['104.625,-10.6875,103.11328,-10.89844,103.57031,-12.19922,105.32813,-13.11328,106.38281,-11.70703,105.75,-10.33594,104.625,-10.6875']
    }

    const output = pruneSpatial(input as DataWithSpatial)

    expect(output).toEqual({
      boundingBox: undefined,
      circle: undefined,
      line: undefined,
      point: undefined,
      polygon: ['104.625,-10.6875,103.11328,-10.89844,103.57031,-12.19922,105.32813,-13.11328,106.38281,-11.70703,105.75,-10.33594,104.625,-10.6875']
    })
  })
})
