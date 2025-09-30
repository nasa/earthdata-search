import React from 'react'
import Card from 'react-bootstrap/Card'

import { type HomeTopic } from './Home'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import useEdscStore from '../../zustand/useEdscStore'

import './HomeTopicCard.scss'

/**
 * The HomeTopicCard component
*/
const HomeTopicCard: React.FC<HomeTopic> = ({
  image,
  url,
  title
}) => {
  const setOpenFacetGroup = useEdscStore((state) => state.home.setOpenFacetGroup)

  return (
    <Card
      key={title}
      className="text-decoration-none"
      as={PortalLinkContainer}
      to={url}
      updatePath
      naked
      onClick={() => setOpenFacetGroup('science_keywords')}
    >
      <Card.Body className="d-flex align-items-center gap-3">
        <Card.Img className="w-auto flex-shrink-0 flex-grow-0" height={50} width={50} src={image} alt={title} />
        <Card.Title as="h3" className="home-topic-card__title mb-0 h5">{title}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default HomeTopicCard
