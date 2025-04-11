import React, { useContext } from 'react'
import { Card } from 'react-bootstrap'

// @ts-expect-error: Types do not exist for this file
import StartDrawingContext, { StartDrawingContextType } from '../../contexts/StartDrawingContext'

import { type HomeTopic } from './Home'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './HomeTopicCard.scss'

const HomeTopicCard: React.FC<HomeTopic> = ({
  image,
  url,
  title
}) => {
  const { setOpenKeywordFacet } = useContext(StartDrawingContext) as StartDrawingContextType

  return (
    <Card
      key={title}
      className="text-decoration-none"
      as={PortalLinkContainer}
      to={url}
      updatePath
      naked
      onClick={() => setOpenKeywordFacet(true)}
    >
      <Card.Body className="d-flex align-items-center gap-3">
        <Card.Img className="w-auto flex-shrink-0 flex-grow-0" height={50} width={50} src={image} alt={title} />
        <Card.Title as="h3" className="home-topic-card__title mb-0 h5">{title}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default HomeTopicCard
