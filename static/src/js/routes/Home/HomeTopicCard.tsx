import React from 'react'
import { Card } from 'react-bootstrap'

import { type HomeTopic } from './Home'
// @ts-ignore
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './HomeTopicCard.scss'

interface HomeTopicCardProps extends HomeTopic {}

const HomeTopicCard: React.FC<HomeTopicCardProps> = ({
  color,
  image,
  url,
  title
}) => (
  <Card key={title} className="text-decoration-none" as={PortalLinkContainer} to={url} updatePath naked>
    <Card.Body className="d-flex align-items-center gap-3">
      <div className="home-card__image d-flex align-items-center justify-content-center flex-shrink-0 flex-grow-0 rounded-circle" style={{ backgroundColor: color }}>
        <Card.Img className="w-auto flex-shrink-0 flex-grow-0" height={50} width={50} src={image} />
      </div>
      <Card.Title as="h3" className="home-topic-card__title mb-0 h5">{title}</Card.Title>
    </Card.Body>
  </Card>
)

export default HomeTopicCard