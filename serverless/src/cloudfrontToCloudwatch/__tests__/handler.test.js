/* eslint-disable no-tabs */
import zlib from 'zlib'
import util from 'util'

import AWS from 'aws-sdk'

import cloudfrontToCloudwatch from '../handler'

// Promisify node method
const gzip = util.promisify(zlib.gzip)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloudfrontToCloudwatch', () => {
  test('takes no action when no events are provided', async () => {
    const consoleMock = jest.spyOn(console, 'log')

    await cloudfrontToCloudwatch({})

    expect(consoleMock).toBeCalledTimes(0)
  })

  test('retrieves logs from S3 and parses them correctly', async () => {
    // Contents of a log file from cloudfront
    const testFileContents = `#Version: 1.0
#Fields: date time x-edge-location sc-bytes c-ip cs-method cs(Host) cs-uri-stem sc-status cs(Referer) cs(User-Agent) cs-uri-query cs(Cookie) x-edge-result-type x-edge-request-id x-host-header cs-protocol cs-bytes time-taken x-forwarded-for ssl-protocol ssl-cipher x-edge-response-result-type cs-protocol-version fle-status fle-encrypted-fields c-port time-to-first-byte x-edge-detailed-result-type sc-content-type sc-content-len sc-range-start sc-range-end
2020-04-02	13:54:04	IAD79-C2	749	000.111.222.333	GET	test.cloudfront.net	/login	307	https://example.com	Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_14_6)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/80.0.3987.149%20Safari/537.36	ee=sit&state=https%253A%252F%252Fsearch.sit.earthdata.nasa.gov%252FsearcMiss	doc-3CI0AzEkTaKasIxhtQh30-mP6wqSTeB7ibbJ4UQtfpF6xkos8Q==	test.cloudfront.net	https	442	3.883	-	TLSv1.2	ECDHE-RSA-AES128-GCM-SHA256	Miss	HTTP/2.0	-	-	28975	3.883	Miss	application/json	0	-
2020-04-02	13:54:20	IAD79-C2	783	000.111.222.333	GET	test.cloudfront.net	/urs_callback	307	https://sit.urs.earthdata.nasa.gov/	Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_14_6)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/80.0.3987.149%20Safari/537.36	code=0937ee4bc1ea726aa9f1494bdb1bdfe5fcd54509c081de78b6e65334fefecd90&state=https%253A%252F%252Fsearch%252Esit%252Eearthdata%252Enasa%252Egov%252Fsearch	-	Miss	7Ss55XTl-STpO-9YhNPAap-t1y9Y_u4rTjE37om9BtwCrS9Vy9Q4Lw==	test.cloudfront.net	https	160	3.724	-	TLSv1.2	ECDHE-RSA-AES128-GCM-SHA256	Miss	HTTP/2.0	-	-	28975	3.724	Miss	application/json	0	-	-
2020-04-02	13:54:23	IAD79-C2	783	000.111.222.333	OPTIONS	test.cloudfront.net	/collections/json	200	https://example.com	Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_14_6)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/80.0.3987.149%20Safari/537.36	-	-	Miss	_NM6kS06HE1bzTcJ035oILNkjNXRqLSQ0nU1gp-HGYiS1sWqef3fNg==	test.cloudfront.net	https	358	1.270	-	TLSv1.2	ECDHE-RSA-AES128-GCM-SHA256	Miss	HTTP/2.0	-	-	18129	1.270	Miss	application/json	1	-	-
2020-04-02	13:54:30	IAD79-C2	10647	000.111.222.333	POST	test.cloudfront.net	/collections/json	200	https://example.com	Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_14_6)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/80.0.3987.149%20Safari/537.36	-	-	Miss	N0Pjfke7DKz2yOeFgIDlHiTyQMyEZm2NoHkuUgBPA4XCUkBd6RQ7aw==	test.cloudfront.net	https	662	6.308	-	TLSv1.2	ECDHE-RSA-AES128-GCM-SHA256	Miss	HTTP/2.0	-	-	18129	6.308	Miss	application/json	-	-	-
`

    // gzip the test file contents
    const zippedFile = await gzip(Buffer.from(testFileContents))

    const consoleMock = jest.spyOn(console, 'log')

    const s3GetObjectPromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Body: zippedFile
      })
    })

    AWS.S3 = jest.fn()
      .mockImplementation(() => ({
        getObject: s3GetObjectPromise
      }))

    await cloudfrontToCloudwatch({
      Records: [{
        s3: {
          bucket: {
            name: 'test-bucket'
          },
          object: {
            key: 'test-object.gz'
          }
        }
      }]
    })

    expect(s3GetObjectPromise.mock.calls[0]).toEqual([{
      Bucket: 'test-bucket',
      Key: 'test-object.gz'
    }])

    expect(consoleMock).toBeCalledTimes(5)
    expect(consoleMock.mock.calls[0]).toEqual(['Processing 1 files(s)'])
  })

  test('catches errors correctly', async () => {
    const consoleMock = jest.spyOn(console, 'log')

    const s3GetObjectPromise = jest.fn().mockReturnValue({
      // eslint-disable-next-line no-promise-executor-return
      promise: jest.fn().mockImplementation(() => new Promise((resolve, reject) => reject(new Error('Object not found.'))))
    })

    AWS.S3 = jest.fn()
      .mockImplementation(() => ({
        getObject: s3GetObjectPromise
      }))

    await cloudfrontToCloudwatch({
      Records: [{
        s3: {
          bucket: {
            name: 'test-bucket'
          },
          object: {
            key: 'test-object.gz'
          }
        }
      }]
    })

    expect(s3GetObjectPromise.mock.calls[0]).toEqual([{
      Bucket: 'test-bucket',
      Key: 'test-object.gz'
    }])

    expect(consoleMock).toBeCalledTimes(2)
    expect(consoleMock.mock.calls[0]).toEqual(['Processing 1 files(s)'])
    expect(consoleMock.mock.calls[1]).toEqual(['Error: Object not found.'])
  })
})
