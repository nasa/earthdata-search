import { shapefileEventTypes } from '../../constants/eventTypes'
import useEdscStore from '../../zustand/useEdscStore'
import addShapefile from '../addShapefile'

import * as EventEmitter from '../../events/events'

import type { ShapefileFile } from '../../types/sharedTypes'

describe('addShapefile', () => {
  test('calls saveShapefile and emits an event', async () => {
    const mockFile = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            coordinates: [
              -77.0163,
              38.883
            ],
            type: 'Point'
          }
        }
      ]
    } as ShapefileFile

    const mockFileWithIds = {
      features: [{
        geometry: {
          coordinates: [-77.0163, 38.883],
          type: 'Point'
        },
        properties: { edscId: '0' },
        type: 'Feature'
      }],
      name: 'testfile.geojson',
      type: 'FeatureCollection'
    }

    const mockFilename = 'testfile.geojson'
    const mockSize = '10.00 KB'

    const saveShapefileSpy = jest.fn()
    jest.spyOn(useEdscStore.getState().shapefile, 'saveShapefile').mockImplementation(saveShapefileSpy)

    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emitBuffered')

    await addShapefile({
      file: mockFile,
      filename: mockFilename,
      size: mockSize,
      updateQuery: true
    })

    expect(saveShapefileSpy).toHaveBeenCalledTimes(1)
    expect(saveShapefileSpy).toHaveBeenCalledWith({
      file: mockFileWithIds,
      filename: mockFilename,
      size: mockSize
    })

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(
      shapefileEventTypes.ADDSHAPEFILE,
      mockFile,
      mockFileWithIds,
      true
    )
  })
})
