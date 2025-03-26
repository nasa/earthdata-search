import { useCallback, useState } from 'react'
// @ts-ignore
import { sortBy } from 'lodash-es'
import { Card, Col, Collapse, Container, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap'

// @ts-ignore
import { usePortalLogo } from '../../hooks/usePortalLogo'

// @ts-ignore
import { ArrowCircleDown, ArrowCircleUp, Search } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../../components/Button/Button'
// @ts-ignore
import EDSCIcon from '../../components/EDSCIcon/EDSCIcon'
// @ts-ignore
import Spinner from '../../components/Spinner/Spinner'
import SpatialSelectionDropdownContainer
  // @ts-ignore
  from '../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer'
import TemporalSelectionDropdownContainer
  // @ts-ignore
  from '../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer'
// @ts-ignore

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import availablePortals from '../../../../../portals/availablePortals.json'

// @ts-ignore
import topicIconAtmosphere from '~Images/homepage-topic-icons/atmosphere-icon.svg'
// @ts-ignore
import topicIconBiosphere from '~Images/homepage-topic-icons/biosphere-icon.svg'
// @ts-ignore
import topicIconClimateIndicators from '~Images/homepage-topic-icons/climate-indicators-icon.svg'
// @ts-ignore
import topicIconCryosphere from '~Images/homepage-topic-icons/cryosphere-icon.svg'
// @ts-ignore
import topicIconHumanDimensions from '~Images/homepage-topic-icons/human-dimensions-icon.svg'
// @ts-ignore
import topicIconLandSurface from '~Images/homepage-topic-icons/land-surface-icon.svg'
// @ts-ignore
import topicIconOcean from '~Images/homepage-topic-icons/ocean-icon.svg'
// @ts-ignore
import topicIconSolidEarth from '~Images/homepage-topic-icons/solid-earth-icon.svg'
// @ts-ignore
import topicIconSunEarthInteractions from '~Images/homepage-topic-icons/sun-earth-interactions-icon.svg'
// @ts-ignore
import topicIconTerrestrialHydrosphere from '~Images/homepage-topic-icons/terrestrial-hydrosphere-icon.svg'

import './Home.scss'

interface HomeTopic {
  /** The title of the topic */
  title: string
  /** The image URL for the topic icon */
  image: string
  /** The URL to navigate to when the topic is clicked */
  url: string
  /** The color of the topic icon */
  color: string
}

const topics: HomeTopic[] = [
  {
    title: 'Atmosphere',
    image: topicIconAtmosphere,
    url: '/search?fst0=Atmosphere',
    color: '#3670DC'
  },
  {
    title: 'Biosphere',
    image: topicIconBiosphere,
    url: '/search??fst0=Biosphere',
    color: '#53B45C'
  },
  {
    title: 'Climate Indicators',
    image: topicIconClimateIndicators,
    url: '/search?fst0=Climate+Indicators',
    color: '#3F8E7D'
  },
  {
    title: 'Cryosphere',
    image: topicIconCryosphere,
    url: '/search?fst0=Cryosphere',
    color: '#82A2AA'
  },
  {
    title: 'Human Dimensions',
    image: topicIconHumanDimensions,
    url: '/search?fst0=Human+Dimensions',
    color: '#D24032'
  },
  {
    title: 'Land Surface',
    image: topicIconLandSurface,
    url: '/search?fst0=Land+Surface',
    color: '#367A3E'
  },
  {
    title: 'Oceans',
    image: topicIconOcean,
    url: '/search?fst0=Oceans',
    color: '#0B3D91'
  },
  {
    title: 'Solid Earth',
    image: topicIconSolidEarth,
    url: '/search?fst0=Solid+Earth',
    color: '#42636F'
  },
  {
    title: 'Sun-Earth Interactions',
    image: topicIconSunEarthInteractions,
    url: '/search?fst0=Sun-Earth+Interactions',
    color: '#E6A059'
  },
  {
    title: 'Terrestrial Hydrosphere',
    image: topicIconTerrestrialHydrosphere,
    url: '/search?fst0=Terrestrial+Hydrosphere',
    color: '#5AC5AD'
  }
]

interface HomeTopicCardProps extends HomeTopic {}

const HomeTopicCard: React.FC<HomeTopicCardProps> = ({ color, image, url, title }) => (
  <Card key={title} className="text-decoration-none" as={PortalLinkContainer} to={url} updatePath naked bg="white">
    <Card.Body className="d-flex align-items-center gap-3">
      <div className="home-card__image d-flex align-items-center justify-content-center flex-shrink-0 flex-grow-0 rounded-circle" style={{ backgroundColor: color }}>
        <Card.Img className="w-auto flex-shrink-0 flex-grow-0" height={50} width={50} src={image} />
      </div>
      <Card.Title as="h3" className="mb-0 h5">{title}</Card.Title>
    </Card.Body>
  </Card>
)

interface PortalLogoProps {
  /** The portal id used to identify the portal */
  portalId: string,
  /** The primary title of the portal */
  primaryTitle: string,
  /** The secondary title of the portal */
  secondaryTitle?: string
}

const PortalLogo: React.FC<PortalLogoProps> = ({ portalId, primaryTitle, secondaryTitle }) => {
  const portalLogoSrc = usePortalLogo(portalId)

  const [thumbnailLoading, setThumbnailLoading] = useState(portalLogoSrc === undefined)

  const onThumbnailLoaded = useCallback(() => {
    setThumbnailLoading(false)
  }, [])

  const displayTitle = `${primaryTitle}${secondaryTitle && ` (${secondaryTitle})`}`

  return (portalLogoSrc === undefined || portalLogoSrc) && (
    <div style={{ width: 56, height: 56 }} className="d-flex align-items-center justify-content-center">
      {
        thumbnailLoading && (
          <Spinner
            className="portal-list__thumb-spinner"
            dataTestId="portal-thumbnail-spinner"
            type="dots"
            color="gray"
            size="x-tiny"
          />
        )
      }
      {
        portalLogoSrc && (
          <img
            className="flex-shrink-0 flex-grow-0 w-100 h-auto"
            alt={`A logo for ${displayTitle}`}
            src={portalLogoSrc}
            width="56"
            height="56"
            onLoad={() => onThumbnailLoaded()}
          />
        )
      }
    </div>
  )
}

interface HomePortal {
  image: string
  portalId: string
  subtitle: string
  title: string
  url: string
}

interface HomePortalCardProps extends HomePortal {}

const HomePortalCard: React.FC<HomePortalCardProps> = (portal) => {
  const { portalId, title, subtitle } = portal

  return (
    <Card key={title} className="text-decoration-none" as={PortalLinkContainer} to={`/search`} newPortal={portal} updatePath naked bg="white">
      <Card.Body className="d-flex flex-column align-items-start gap-2">
        <PortalLogo portalId={portalId} primaryTitle={title} secondaryTitle={subtitle} />
        <Card.Title as="h3" className="mb-0 h5">{title}</Card.Title>
        <Card.Subtitle className="small">{subtitle}</Card.Subtitle>
      </Card.Body>
    </Card>
  )
}

const Home = () => {
  const [showAllPortals, setShowAllPortals] = useState(false)

  const onShowAllPortalsClick = () => {
    setShowAllPortals(!showAllPortals)
  }

  const sortedPortals: HomePortal[] = sortBy(availablePortals, (portal: any) => portal.title.primary)
    .filter((portal: any) => portal.portalBrowser)
    .map((portal: any) => ({
      image: portal.portalLogoSrc,
      portalId: portal.portalId,
      subtitle: portal.title.secondary,
      title: portal.title.primary,
      url: portal.url
    }))

  const visiblePortals = sortedPortals.slice(0, 10)
  const hiddenPortals = sortedPortals.slice(10)

  const [keyword, setKeyword] = useState('')

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  return (
    <main className="route-wrapper route-wrapper--content-page route-wrapper--home">
      <div className="route-wrapper__content">
        <section className="home__hero position-relative w-100 d-flex px-5 flex-column justify-content-center align-items-center flex-shrink-0 gap-5">
          <div className="text-center z-1 d-flex gap-3 flex-column">
            <h1 className="text-white display-7">Search NASA&apos;s 1.8 billion+ Earth observations</h1>
            <p className="text-white mb-0 lead">Use keywords and filter by time and spatial area to search NASA's Earth science data</p>
          </div>
          <div className="d-flex flex-shrink-1 flex-column align-items-stretch gap-5 z-1">
            <div className="home__hero-input-wrapper w-100 d-flex flex-shrink-1 flex-grow-1 justify-content-center align-items-center gap-3">
              <div className="d-flex justify-content-center flex-grow-1">
                <div className="d-flex flex-grow-1 position-relative">
                  <EDSCIcon className="home__hero-input-icon position-absolute" icon={Search} size="22" />
                  <input className="home__hero-input flex-grow-1 form-control form-control-lg border-end-0" type="text" placeholder="Type to search for data" value={keyword} onChange={onChangeKeyword} />
                </div>
                <div className="d-flex gap-3 align-items-center ps-2 pe-2 bg-white border-top border-bottom">
                  <TemporalSelectionDropdownContainer />
                  <SpatialSelectionDropdownContainer />
                </div>
                <PortalLinkContainer className="btn btn-primary btn-lg" variant="primary" size="lg" to={`/search?q=${keyword}`} updatePath>Search</PortalLinkContainer>
              </div>
            </div>
            <div className="d-flex flex-grow-1 justify-content-center">
              <PortalLinkContainer className="mt-5" type="button" updatePath variant="hds-primary" bootstrapSize="lg" dark to="/search">Browse all Earth Science Data</PortalLinkContainer>
            </div>
          </div>
          <OverlayTrigger
            trigger="click"
            placement="top"
            rootClose
            overlay={
              <Popover id="hero-image-popover" className="home__hero-image-popover bg-black text-white" style={{ minWidth: '19rem', maxWidth: '19rem' }}>
                <Popover.Body className="bg-black text-white">
                  <p>
                    Swirls of cloud are visible in the Atlantic Ocean near Cabo Verde in this true-color corrected reflectance image from the <strong>Moderate Resolution Imaging Spectroradiometer (MODIS)</strong> aboard the <strong>Terra</strong> platform on March 12, 2025
                  </p>
                  <PortalLinkContainer type="button" variant="hds-primary" dark to="/search/granules?p=C1378579425-LAADS&pg[0][v]=f&q=MOD02QKM&sb[0]=-29.95172%2C11.43036%2C-16.57503%2C19.31775&qt=2025-03-12T00%3A00%3A00.000Z%2C2025-03-12T23%3A59%3A59.999Z&tl=1742988379.162!3!!&lat=15.539366708787597&long=-28.25244140625&zoom=6" updatePath>Explore this data on the map</PortalLinkContainer>
                </Popover.Body>
              </Popover>
            }
          >
            <Button className="home__hero-image-link position-absolute text-white" bootstrapVariant="link">What is this image?</Button>
          </OverlayTrigger>
        </section>
        <section className="py-5">
          <Container>
            <Row>
              <Col>
                <h2 className="h1">Browse Data by Topic</h2>
                <p>Search for data within a research area</p>
              </Col>
            </Row>
            {/* @ts-ignore */}
            <div className="grid" style={{ "--bs-columns": 5, "--bs-gap": "1rem" }}>
              {
                topics && topics.map((topic) => (
                  <HomeTopicCard key={topic.title} {...topic} />
                ))
              }
            </div>
          </Container>
        </section>
        <section className="py-5 mb-5">
          <Container>
            <Row>
              <Col>
                <h2 className="h1">Browse Data by Portal</h2>
                <p>Search for data using curated portals to limit results to an area of interest, project, or organization</p>
              </Col>
            </Row>
            {/* @ts-ignore */}
            <div className="grid" style={{ "--bs-columns": 5, "--bs-gap": "1rem" }}>
              {
                visiblePortals && visiblePortals.map((portal) => (
                  <HomePortalCard key={portal.title} {...portal} />
                ))
              }
            </div>
            <Collapse in={showAllPortals}>
              {/* @ts-ignore */}
              <div className="grid mt-3" style={{ "--bs-columns": 5, "--bs-gap": "1rem" }}>
                {
                  hiddenPortals && hiddenPortals.map((portal) => (
                    <HomePortalCard key={portal.title} {...portal} />
                  ))
                }
              </div>
            </Collapse>
            <div className="mt-3 d-flex justify-content-center align-items-center">
              {
                !showAllPortals && <Button variant="naked" icon={ArrowCircleDown} iconPosition="right" bootstrapVariant="naked" onClick={() => onShowAllPortalsClick()}>Show all portals</Button>
              }
              {
                showAllPortals && <Button variant="naked" icon={ArrowCircleUp} iconPosition="right" bootstrapVariant="naked" onClick={() => onShowAllPortalsClick()}>Show fewer portals</Button>
              }
            </div>
          </Container>
        </section>
      </div>
    </main>
  )
}

export default Home
