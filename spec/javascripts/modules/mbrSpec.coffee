
describe "mbr", ->
  module = window.edsc.map.mbr

  describe 'divideMbr', ->
    divideMbr = module.divideMbr

    it "returns the mbr if the input doesn't cross the antimeridian", ->
      mbr = [0, 0, 10, 10]
      expect(divideMbr(mbr)).toEqual([mbr])

    it "returns an eastern and western mbr the input crosses the antimeridian", ->
      mbr = [0, 170, 10, -170]
      expect(divideMbr(mbr)).toEqual([[0, -180, 10, -170], [0, 170, 10, 180]])

    it "returns an mbr spanning 180 degrees if the input's eastern and western points are the same", ->
      mbr = [0, 0, 10, 0]
      expect(divideMbr(mbr)).toEqual([[0, -180, 10, 180]])

  describe 'mergeMbrs', ->
    mergeMbrs = module.mergeMbrs

    describe "multiple boxes", ->
      it "returns the mbr of three or more boxes", ->
        mbrs = [[0, 0, 10, 10], [5, 1, 20, 20], [-10, -10, 5, 5]]
        expect(mergeMbrs(mbrs)).toEqual([-10, -10, 20, 20])

    describe 'latitude extension', ->
      it 'returns an mbr containing the northernmost latitude', ->
        mbrs = [[0, 0, 10, 10], [5, 1, 20, 9]]
        expect(mergeMbrs(mbrs)).toEqual([0, 0, 20, 10])

      it 'returns an mbr containing the southernmost latitude', ->
        mbrs = [[0, 0, 10, 10], [5, 1, 20, 9]]
        expect(mergeMbrs(mbrs)).toEqual([0, 0, 20, 10])

    describe 'longitude extension', ->
      describe 'when one box is entirely contained within another', ->
        mbrs = [[0, 0, 30, 30], [10, 10, 20, 20]]
        it "returns the outer box", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 0, 30, 30])

      describe 'when one box is entirely contained within another, crossing the antimeridian', ->
        mbrs = [[0, 160, 30, -160], [10, 170, 20, -170]]
        it "returns the outer box, wrapped around the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 160, 30, -160])

      describe 'when the boxes overlap to the west', ->
        mbrs = [[0, 0, 30, 30], [10, -10, 20, 20]]
        it "returns a bounding box extended to the west", ->
          expect(mergeMbrs(mbrs)).toEqual([0, -10, 30, 30])

      describe 'when the boxes overlap to the west, crossing the antimeridian', ->
        mbrs = [[0, 160, 30, -160], [10, 150, 20, -170]]
        it "returns a bounding box extended to the west, and crossing the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 150, 30, -160])

      describe 'when the boxes overlap to the east', ->
        mbrs = [[0, 0, 30, 30], [10, 10, 20, 40]]
        it "returns a bounding box extended to the east", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 0, 30, 40])

      describe 'when the boxes overlap to the east, crossing the antimeridian', ->
        mbrs = [[0, 160, 30, -160], [10, 170, 20, -150]]
        it "returns a bounding box extended to the east, and crossing the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 160, 30, -150])

      describe 'when one box is entirely west of the other', ->
        mbrs = [[0, 0, 30, 10], [10, 20, 20, 40]]
        it "returns the westernmost point of the western box and the easternost of the eastern", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 0, 30, 40])

      describe 'when one box is entirely west of the other, crossing the antimeridian', ->
        mbrs = [[0, 170, 30, -170], [10, -160, 20, -150]]
        it "returns the westernmost point of the western box and the easternost of the eastern, crossing the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 170, 30, -150])

      describe 'when one box is entirely west of the other, and the other crosses the antimeridian', ->
        mbrs = [[10, 150, 20, 160], [0, 170, 30, -170]]
        it "returns the westernmost point of the western box and the easternost of the eastern, crossing the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 150, 30, -170])

      describe 'when one box is entirely east of the other', ->
        mbrs = [[10, 20, 20, 40], [0, 0, 30, 10]]
        it "returns the westernmost point of the western box and the easternost of the eastern", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 0, 30, 40])

      describe 'when one box is entirely east of the other, crossing the antimeridian', ->
        mbrs = [[10, -160, 20, -150], [0, 170, 30, -170]]
        it "returns the westernmost point of the western box and the easternost of the eastern, crossing the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 170, 30, -150])

      describe 'when one box is entirely east of the other, and the other crosses the antimeridian', ->
        mbrs = [[0, 170, 30, -170], [10, 150, 20, 160]]
        it "returns the westernmost point of the western box and the easternost of the eastern, crossing the antimeridian", ->
          expect(mergeMbrs(mbrs)).toEqual([0, 150, 30, -170])
