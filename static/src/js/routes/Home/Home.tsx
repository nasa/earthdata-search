import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { sortBy } from 'lodash-es'
import Col from 'react-bootstrap/Col'
import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'
import { connect, MapDispatchToProps } from 'react-redux'
import { withRouter, type RouteComponentProps } from 'react-router-dom'
import { type Dispatch } from 'redux'

import {
  ArrowCircleDown,
  ArrowCircleUp,
  Search
  // @ts-expect-error: Types do not exist for this file
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../../components/Button/Button'
// @ts-expect-error: Types do not exist for this file
import EDSCIcon from '../../components/EDSCIcon/EDSCIcon'

import SpatialSelectionDropdownContainer
// @ts-expect-error: Types do not exist for this file
  from '../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer'
import TemporalSelectionDropdownContainer
// @ts-expect-error: Types do not exist for this file
  from '../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import TopicCard from './HomeTopicCard'
import HomePortalCard from './HomePortalCard'

import availablePortals from '../../../../../portals/availablePortals.json'

import topicIconAtmosphere from '~Images/homepage-topic-icons/atmosphere-icon.svg'
import topicIconBiosphere from '~Images/homepage-topic-icons/biosphere-icon.svg'
import topicIconClimateIndicators from '~Images/homepage-topic-icons/climate-indicators-icon.svg'
import topicIconCryosphere from '~Images/homepage-topic-icons/cryosphere-icon.svg'
import topicIconHumanDimensions from '~Images/homepage-topic-icons/human-dimensions-icon.svg'
import topicIconLandSurface from '~Images/homepage-topic-icons/land-surface-icon.svg'
import topicIconOcean from '~Images/homepage-topic-icons/ocean-icon.svg'
import topicIconSolidEarth from '~Images/homepage-topic-icons/solid-earth-icon.svg'
import topicIconSunEarthInteractions from '~Images/homepage-topic-icons/sun-earth-interactions-icon.svg'
import topicIconTerrestrialHydrosphere from '~Images/homepage-topic-icons/terrestrial-hydrosphere-icon.svg'

// @ts-expect-error: Types do not exist for this file
import heroImgSourcesSmall from '~Images/homepage-hero/MODIS-Terra-Swirling-Clouds-In-Atlantic-800x600@2x.jpg?format=webp&w=800;1600'
// @ts-expect-error: Types do not exist for this file
import heroImgSources from '~Images/homepage-hero/MODIS-Terra-Swirling-Clouds-In-Atlantic-2560x1440@2x.jpg?format=webp&w=1280;1920;2560;3840;5120'

// @ts-expect-error: Types do not exist for this file
import actions from '../../actions'

import getHeroImageSrcSet from '../../../../../vite_plugins/getHeroImageSrcSet'

import './Home.scss'
// TODO: Clean up css so preloading this file is not necessary
import '../../components/SearchForm/SearchForm.scss'

const { preloadSrcSet, preloadSizes } = getHeroImageSrcSet(
  [...heroImgSourcesSmall, ...heroImgSources]
)

let preloaded = false
const preloadRoutes = () => {
  if (preloaded) return
  preloaded = true

  // @ts-expect-error: Types are not defined in this file
  import('../Search/Search')
  // @ts-expect-error: Types are not defined in this file
  import('../../components/SearchTour/SearchTour')
  import('../../containers/MapContainer/MapContainer')
}

export const mapDispatchToProps: MapDispatchToProps<object, object> = (dispatch: Dispatch) => ({
  onChangePath:
    (path: string) => dispatch(actions.changePath(path))
})
export interface HomeTopic {
  /** The title of the topic */
  title: string
  /** The image URL for the topic icon */
  image: string
  /** The URL to navigate to when the topic is clicked */
  url: string
}

const topics: HomeTopic[] = [
  {
    title: 'Atmosphere',
    image: topicIconAtmosphere,
    url: '/search?fst0=Atmosphere'
  },
  {
    title: 'Biosphere',
    image: topicIconBiosphere,
    url: '/search?fst0=Biosphere'
  },
  {
    title: 'Climate Indicators',
    image: topicIconClimateIndicators,
    url: '/search?fst0=Climate+Indicators'
  },
  {
    title: 'Cryosphere',
    image: topicIconCryosphere,
    url: '/search?fst0=Cryosphere'
  },
  {
    title: 'Human Dimensions',
    image: topicIconHumanDimensions,
    url: '/search?fst0=Human+Dimensions'
  },
  {
    title: 'Land Surface',
    image: topicIconLandSurface,
    url: '/search?fst0=Land+Surface'
  },
  {
    title: 'Oceans',
    image: topicIconOcean,
    url: '/search?fst0=Oceans'
  },
  {
    title: 'Solid Earth',
    image: topicIconSolidEarth,
    url: '/search?fst0=Solid+Earth'
  },
  {
    title: 'Sun-Earth Interactions',
    image: topicIconSunEarthInteractions,
    url: '/search?fst0=Sun-Earth+Interactions'
  },
  {
    title: 'Terrestrial Hydrosphere',
    image: topicIconTerrestrialHydrosphere,
    url: '/search?fst0=Terrestrial+Hydrosphere'
  }
]

interface PortalTitle {
  /** The primary title of the portal */
  primary: string
  /** The secondary title of the portal */
  secondary?: string
}

export interface Portal {
  /** A flag that denotes if the portal should be included in the portal browser */
  portalBrowser?: boolean
  /** The image URL for the portal logo */
  portalLogoSrc?: string
  /** The ID of the portal */
  portalId: string
  /** The title of the portal */
  title: PortalTitle
/** The URL to navigate to when the portal is clicked */
  moreInfoUrl?: string
}

interface HomeDispatchProps {
  /** The Redux action to change the path */
  onChangePath: (path: string) => void
}

type HomeProps = HomeDispatchProps & RouteComponentProps

export const Home: React.FC<HomeProps> = ({ onChangePath, history }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showAllPortals, setShowAllPortals] = useState(false)

  useEffect(() => {
    // Focus the search input when the component mounts
    if (inputRef.current) {
      inputRef.current?.focus()
    }

    // This event listener is used to load the Search and Map components
    // when the DOM is ready which helps prevent a flash of white when the
    // page loads.
    document.addEventListener('mouseover', preloadRoutes)
    document.addEventListener('keydown', preloadRoutes)

    return () => {
      document.removeEventListener('mouseover', preloadRoutes)
      document.removeEventListener('keydown', preloadRoutes)
    }
  }, [])

  const onShowAllPortalsClick = (): void => {
    setShowAllPortals(!showAllPortals)
  }

  const sortedPortals: Portal[] = sortBy(availablePortals, (portal: Portal) => portal.title.primary)
    .filter((portal: Portal) => portal.portalBrowser)

  const visiblePortals = sortedPortals.slice(0, 10)
  const hiddenPortals = sortedPortals.slice(10)

  const [keyword, setKeyword] = useState('')

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const searchParams = {
    q: keyword
  }

  return (
    <main className="route-wrapper route-wrapper--content-page route-wrapper--home">
      <div className="route-wrapper__content">
        <section
          className="home__hero position-relative w-100 d-flex px-5 flex-column justify-content-center flex-shrink-0 gap-5"
        >
          <picture className="home__hero-image position-absolute">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img
              srcSet={preloadSrcSet}
              sizes={preloadSizes}
              alt="Swirls of cloud are visible in the Atlantic Ocean near Cabo Verde in this true-color corrected reflectance image from the Moderate Resolution Imaging Spectroradiometer (MODIS) aboard the Terra platform on March 12, 2025"
            />
          </picture>
          <div className="text-center z-1 d-flex gap-3 flex-column">
            <h1 className="text-white display-7">Search NASA&apos;s 1.8 billion+ Earth observations</h1>
            <p className="text-white mb-0 lead">Use keywords and filter by time and spatial area to search NASA&apos;s Earth science data</p>
          </div>
          <div className="d-flex flex-shrink-1 flex-column align-items-stretch gap-5 z-1">
            <div className="home__hero-input-wrapper w-100 d-flex flex-shrink-1 flex-grow-1 justify-content-center align-items-center gap-3">
              <form
                className="d-flex justify-content-center flex-grow-1 flex-shrink-1"
                onSubmit={
                  (e) => {
                    e.preventDefault()
                    onChangePath(`/search?q=${keyword}`)
                    history.push(`/search?q=${keyword}`)
                  }
                }
              >
                <div className="d-flex flex-grow-1 position-relative flex-shrink-1">
                  <EDSCIcon className="home__hero-input-icon position-absolute" icon={Search} size="22px" />
                  <input
                    className="home__hero-input flex-grow-1 flex-shrink-1 form-control form-control-lg border-end-0"
                    type="text"
                    placeholder="Type to search for data"
                    value={keyword}
                    onChange={onChangeKeyword}
                    ref={inputRef}
                  />
                </div>
                <div className="d-flex gap-2 align-items-center flex-shrink-0 ps-2 pe-2 bg-white border-top border-bottom">
                  <TemporalSelectionDropdownContainer searchParams={searchParams} />
                  <SpatialSelectionDropdownContainer searchParams={searchParams} />
                </div>
                <Button type="submit" className="home__hero-submit-button flex-shrink-0 btn btn-primary btn-lg focus-light" bootstrapVariant="primary" bootstrapSize="lg">Search</Button>
              </form>
            </div>
            <div className="d-flex flex-grow-1 justify-content-center">
              <PortalLinkContainer className="mt-5 focus-light" type="button" updatePath variant="hds-primary" bootstrapSize="lg" dark to="/search">Browse all Earth Science Data</PortalLinkContainer>
            </div>
          </div>
          <OverlayTrigger
            trigger="click"
            placement="top"
            rootClose
            overlay={
              (
                <Popover
                  id="hero-image-popover"
                  className="home__hero-image-popover bg-black text-white"
                  style={
                    {
                      minWidth: '19rem',
                      maxWidth: '19rem'
                    }
                  }
                >
                  <Popover.Body className="bg-black text-white">
                    <p>
                      {/* eslint-disable-next-line max-len */}
                      Swirls of cloud are visible in the Atlantic Ocean near Cabo Verde in this true-color corrected reflectance image from the
                      {' '}
                      <strong>Moderate Resolution Imaging Spectroradiometer (MODIS)</strong>
                      {' '}
                      aboard the
                      {' '}
                      <strong>Terra</strong>
                      {' '}
                      platform on March 12, 2025
                    </p>
                    <PortalLinkContainer className="focus-light" type="button" variant="hds-primary" dark to="/search/granules?p=C1378579425-LAADS&pg[0][v]=f&q=MOD02QKM&pg[0][gsk]=-start_date&sb[0]=-29.95172%2C11.43036%2C-16.57503%2C19.31775&qt=2025-03-12T00%3A00%3A00.000Z%2C2025-03-12T23%3A59%3A59.999Z&tl=1347419148.752!5!!&lat=15.27060660&long=-22.78519821&zoom=6" updatePath>Explore this data on the map</PortalLinkContainer>
                  </Popover.Body>
                </Popover>
              )
            }
          >
            <div className="home__hero-image-link position-absolute">
              <Button className="text-white focus-light" bootstrapVariant="link">What is this image?</Button>
            </div>
          </OverlayTrigger>
        </section>
        <section className="py-5">
          <Container className="home__container">
            <Row>
              <Col>
                <h2 className="h1">Browse Data by Topic</h2>
                <p>Search for data within a research area</p>
              </Col>
            </Row>
            <div
              className="home__grid grid"
            >
              {
                topics && topics.map((topic) => (
                  <TopicCard key={topic.title} {...topic} />
                ))
              }
            </div>
          </Container>
        </section>
        <section className="py-5 mb-5">
          <Container className="home__container">
            <Row>
              <Col>
                <h2 className="h1">Browse Data by Portal</h2>
                {/* eslint-disable-next-line max-len */}
                <p>Search for data using curated portals to limit results to an area of interest, project, or organization</p>
              </Col>
            </Row>
            <div
              className="home__grid grid"
            >
              {
                visiblePortals && visiblePortals.map((portal) => (
                  <HomePortalCard key={portal.portalId} {...portal} />
                ))
              }
            </div>
            <Collapse in={showAllPortals}>
              <div
                id="portal-cards-collapse"
                aria-labelledby="portal-collapse-button"
                aria-hidden={!showAllPortals}
                style={{ display: showAllPortals ? '' : 'none' }}
              >
                <div className="home__grid grid mt-3">
                  {
                    hiddenPortals && hiddenPortals.map((portal) => (
                      <HomePortalCard key={portal.portalId} {...portal} />
                    ))
                  }
                </div>
              </div>
            </Collapse>
            <div className="mt-3 d-flex justify-content-center align-items-center">
              {
                !showAllPortals && (
                  <Button
                    id="portal-collapse-button"
                    variant="naked"
                    icon={ArrowCircleDown}
                    iconPosition="right"
                    bootstrapVariant="naked"
                    onClick={onShowAllPortalsClick}
                    aria-expanded={showAllPortals}
                    aria-controls="portal-cards-collapse"
                  >
                    Show all portals
                  </Button>
                )
              }
              {
                showAllPortals && (
                  <Button
                    id="portal-collapse-button"
                    variant="naked"
                    icon={ArrowCircleUp}
                    iconPosition="right"
                    bootstrapVariant="naked"
                    onClick={onShowAllPortalsClick}
                    aria-expanded={showAllPortals}
                    aria-controls="portal-cards-collapse"
                  >
                    Show fewer portals
                  </Button>
                )
              }
            </div>
          </Container>
        </section>
      </div>
    </main>
  )
}

export default withRouter(
  connect(null, mapDispatchToProps)(Home)
)
