// eslint-disable-next-line global-require
const uuid = { ...require('uuid') }

uuid.v4 = () => '00000000-0000-0000-0000-000000000000'

module.exports = uuid
