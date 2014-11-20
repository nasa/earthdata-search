
describe "geoutil", ->
  lls = (latlngs) -> L.latLng(ll) for ll in latlngs
  geoutil = window.edsc.map.geoutil

  describe 'area', ->
    area = geoutil.area

    it 'returns 0 for strings of fewer than 3 lat lngs', ->
      expect(area(lls [])).toEqual(0)
      expect(area(lls [[0, 0]])).toEqual(0)
      expect(area(lls [[0, 0], [10, 0]])).toEqual(0)

    it 'determines correct polygon interior area for polygons containing no poles', ->
      expect(area(lls [[0, 0], [0, 10], [10, 0]])).toBeCloseTo(0.015, 2)

    it 'determines correct polygon interior area for polygons crossing the antimeridian', ->
      expect(area(lls [[0, 175], [0, -175], [10, 175]])).toBeCloseTo(0.015, 2)

    it 'determines correct polygon interior area for polygons containing the north pole', ->
      expect(area(lls [[85, 0], [85, 120], [85, -120]])).toBeCloseTo(0.015, 2)
      expect(area(lls [[-85, 120], [-85, -120], [-85, 0]])).toBeCloseTo(12.55, 2)

    it 'determines correct polygon interior area for polygons containing the south pole', ->
      expect(area(lls [[-85, 0], [-85, -120], [-85, 120]])).toBeCloseTo(0.015, 2)
      expect(area(lls [[85, -120], [85, 120], [85, 0]])).toBeCloseTo(12.55, 2)

    it 'determines correct polygon interior area for polygons containing the both poles', ->
      expect(area(lls [[0, 0], [10, 0], [0, 10]])).toBeCloseTo(12.55, 2)

    it 'determines correct polygon interior area for polygons touching the north pole', ->
      expect(area(lls [[85, 0], [85, 120], [90, 0]])).toBeCloseTo(0.004, 2)

    it 'determines correct polygon interior area for polygons touching the south pole', ->
      expect(area(lls [[-85, 0], [-85, -120], [-90, 0]])).toBeCloseTo(0.004, 2)

    it 'determines correct polygon interior area for polygons touching the both poles', ->
      expect(area(lls [[0, 5], [90, 0], [0, -5], [-90, 0]])).toBeCloseTo(0.30, 2)
