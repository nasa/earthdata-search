import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { fromArrayBuffer } from 'geotiff'
import { getEdlToken } from '../../zustand/selectors/user'

import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
// @ts-expect-error: Types do not exist for this file
import GeoTiffRequest from '../../util/request/geoTiffRequest'

import './GeoTiffInspector.scss'

/** Summary statistics computed from a loaded raster band. */
type RasterStats = {
  width: number
  height: number
  bands: number
  min: number
  max: number
  mean: number
  nodataCount: number
  boundingBox: number[]
}

/**
 * Props accepted by the GeoTiffInspector component.
 */
type GeoTiffInspectorProps = {
  /** URL (or proxy path) of the GeoTIFF to load. */
    url?: string
  /** Request id used to prevent duplicate/stale runs. */
    requestId?: number
  /** Notifies the parent when loading starts or stops. */
    onLoadingChange?: (isLoading: boolean) => void
  /** Called after the raster has been parsed and rendered. */
    onLoadComplete?: (stats: RasterStats) => void
  /** Called when the request or parsing fails. */
    onLoadFailed?: (error: Error) => void
}

const INFERNO_STOPS: Array<[number, number, number]> = [
  [11, 15, 14],
  [59, 30, 107],
  [163, 48, 111],
  [240, 114, 58],
  [255, 226, 138]
]

const infernoColor = (t: number): [number, number, number] => {
  const n = INFERNO_STOPS.length - 1
  const scaled = Math.min(Math.max(t, 0), 1) * n
  const i = Math.min(Math.floor(scaled), n - 1)
  const f = scaled - i
  const [ar, ag, ab] = INFERNO_STOPS[i]
  const [br, bg, bb] = INFERNO_STOPS[i + 1]

  return [
    Math.round(ar + (br - ar) * f),
    Math.round(ag + (bg - ag) * f),
    Math.round(ab + (bb - ab) * f)
  ]
}

const renderRasterToCanvas = (
  canvas: HTMLCanvasElement,
  band: number[] | Float32Array | Float64Array,
  width: number,
  height: number,
  fillValue: number | undefined,
  min: number,
  max: number
) => {
  const maxDim = 512
  const scale = Math.min(1, maxDim / Math.max(width, height))
  const cw = Math.max(1, Math.round(width * scale))
  const ch = Math.max(1, Math.round(height * scale))

  // eslint-disable-next-line no-param-reassign
  canvas.width = cw
  // eslint-disable-next-line no-param-reassign
  canvas.height = ch

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.createImageData(cw, ch)

  for (let y = 0; y < ch; y += 1) {
    for (let x = 0; x < cw; x += 1) {
      const sourceX = Math.min(width - 1, Math.floor(x / scale))
      const sourceY = Math.min(height - 1, Math.floor(y / scale))
      const value = band[(sourceY * width) + sourceX]
      const index = ((y * cw) + x) * 4

      if (value === fillValue || value === 0 || !Number.isFinite(value)) {
        imageData.data[index] = 20
        imageData.data[index + 1] = 20
        imageData.data[index + 2] = 20
        imageData.data[index + 3] = 255
      } else {
        const t = (value - min) / (max - min || 1)
        const [r, g, b] = infernoColor(t)
        imageData.data[index] = r
        imageData.data[index + 1] = g
        imageData.data[index + 2] = b
        imageData.data[index + 3] = 255
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

const GeoTiffInspector: React.FC<GeoTiffInspectorProps> = ({
  url = 'foobar',
  requestId = '1234',
  onLoadingChange = () => {},
  onLoadComplete = () => {},
  onLoadFailed = () => {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastStartedRequestIdRef = useRef<number | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<RasterStats | null>(null)
  const [hasImage, setHasImage] = useState(false)

  const edlToken = useEdscStore(getEdlToken)

  // ASSUMPTION: guessing at where the EDL token lives in the store, following the same
  // `state.<slice>.<field>` shape as `handleError` below (e.g. `state.authToken.token`).
  // Swap `state.authToken.token` for whatever the real slice/selector is.
  const {
    earthdataEnvironment,
    handleError
  } = useEdscStore((state) => ({
    earthdataEnvironment: getEarthdataEnvironment(state),
    edlToken,
    handleError: state.errors.handleError
  }))

  const runLoad = useCallback(async (targetUrl: string, nextRequestId: number) => {
    if (!targetUrl) return

    lastStartedRequestIdRef.current = nextRequestId
    setIsLoading(true)
    setStats(null)
    setHasImage(false)
    onLoadingChange(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      console.log('🚀 ~ file: GeoTiffInspectorApp.tsx:163 ~ edlToken:', edlToken)

      const requestObject = new GeoTiffRequest(edlToken)
      console.log('🚀 ~ file: GeoTiffInspectorApp.tsx:163 ~ requestObject:', requestObject)

      // `.stream()` hits `/geotiffStream?query=<encoded targetUrl>` on our own API host (which
      // in turn talks to the Lambda proxy), and — same as `NlpSearchRequest.stream()` above —
      // returns a fetch-compatible Response, so `.arrayBuffer()` below works directly on it.
      const prompt = ''
      const response = await requestObject.stream(prompt, {
      })
      // Ignore a stale response for a request that's been cancelled/superseded.
      if (lastStartedRequestIdRef.current !== nextRequestId) return

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)

      const buffer = await response.arrayBuffer()
      const tiff = await fromArrayBuffer(buffer)
      const image = await tiff.getImage()

      const width = image.getWidth()
      const height = image.getHeight()
      const bands = image.getSamplesPerPixel()
      const boundingBox = image.getBoundingBox()

      const rasters = await image.readRasters()
      const band = rasters[0] as number[]

      const fillValue = image.getGDALNoData()
      let min = Infinity
      let max = -Infinity
      let sum = 0
      let count = 0
      let nodataCount = 0

      band.forEach((value) => {
        if (value === fillValue || value === 0 || !Number.isFinite(value)) {
          nodataCount += 1

          return
        }

        if (value < min) min = value
        if (value > max) max = value
        sum += value
        count += 1
      })

      const mean = count ? sum / count : NaN

      if (canvasRef.current) {
        renderRasterToCanvas(canvasRef.current, band, width, height, fillValue, min, max)
      }

      setHasImage(true)

      const nextStats: RasterStats = {
        width,
        height,
        bands,
        min,
        max,
        mean,
        nodataCount,
        boundingBox
      }

      setStats(nextStats)
      setIsLoading(false)
      onLoadingChange(false)
      onLoadComplete(nextStats)
    } catch (error) {
      // Ignore a stale error for a request that's been cancelled/superseded.
      if (lastStartedRequestIdRef.current !== nextRequestId) return

      const typedError = error instanceof Error ? error : new Error('Unknown error loading GeoTIFF')

      handleError({
        error: typedError,
        action: 'fetchGeoTiff',
        resource: 'geoTiffInspector',
        showAlertButton: true,
        title: 'Something went wrong loading the GeoTIFF'
      })

      lastStartedRequestIdRef.current = null
      setIsLoading(false)
      onLoadingChange(false)
      onLoadFailed(typedError)
    }
  }, [
    earthdataEnvironment,
    edlToken,
    handleError,
    onLoadComplete,
    onLoadFailed,
    onLoadingChange
  ])

  useEffect(() => () => {
    // Prevent a stale request from resolving into state after unmount / dev
    // Strict Mode remounts.
    lastStartedRequestIdRef.current = null
    abortControllerRef.current?.abort()
  }, [])

  useEffect(() => {
    console.log('effect fired', { requestId })
    if (!requestId || !url) return
    if (lastStartedRequestIdRef.current === requestId) return

    runLoad(url, requestId)
  }, [requestId, runLoad, url])

  return (
    <section className="geotiff-inspector" aria-live="polite">
      {
        isLoading && (
          <div className="geotiff-inspector__panel" role="status" aria-live="polite">
            <Spinner
              type="dots"
              inline
              size="tiny"
              className="geotiff-inspector__step-loader"
              label="GeoTIFF loading in progress"
            />
            <p className="geotiff-inspector__step">Loading GeoTIFF...</p>
          </div>
        )
      }

      <canvas
        ref={canvasRef}
        className={
          ['geotiff-inspector__canvas',
            hasImage ? '' : 'geotiff-inspector__canvas--hidden'
          ].filter(Boolean).join(' ')
        }
      />

      {
        stats && (
          <dl className="geotiff-inspector__stats">
            <div className="geotiff-inspector__stat">
              <dt>Dimensions</dt>
              <dd>{`${stats.width} × ${stats.height} px`}</dd>
            </div>
            <div className="geotiff-inspector__stat">
              <dt>Bands</dt>
              <dd>{stats.bands}</dd>
            </div>
            <div className="geotiff-inspector__stat">
              <dt>Min / Max</dt>
              <dd>{`${stats.min.toFixed(2)} / ${stats.max.toFixed(2)}`}</dd>
            </div>
            <div className="geotiff-inspector__stat">
              <dt>Mean</dt>
              <dd>{stats.mean.toFixed(2)}</dd>
            </div>
            <div className="geotiff-inspector__stat">
              <dt>No-data px</dt>
              <dd>{stats.nodataCount.toLocaleString()}</dd>
            </div>
          </dl>
        )
      }
    </section>
  )
}

export default GeoTiffInspector
