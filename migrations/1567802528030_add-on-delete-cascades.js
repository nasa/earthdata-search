exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.db.query('ALTER TABLE retrieval_collections DROP CONSTRAINT retrieval_collections_retrieval_id_fkey;')
  pgm.db.query('ALTER TABLE retrieval_collections ADD CONSTRAINT retrieval_collections_retrieval_id_fkey FOREIGN KEY (retrieval_id) REFERENCES retrievals (id) ON DELETE CASCADE;')

  pgm.db.query('ALTER TABLE retrieval_orders DROP CONSTRAINT retrieval_orders_retrieval_collection_id_fkey;')
  pgm.db.query('ALTER TABLE retrieval_orders ADD CONSTRAINT retrieval_orders_retrieval_collection_id_fkey FOREIGN KEY (retrieval_collection_id) REFERENCES retrieval_collections (id) ON DELETE CASCADE;')
}

exports.down = (pgm) => {
  pgm.db.query('ALTER TABLE retrieval_collections DROP CONSTRAINT retrieval_collections_retrieval_id_fkey;')
  pgm.db.query('ALTER TABLE retrieval_collections ADD CONSTRAINT retrieval_collections_retrieval_id_fkey FOREIGN KEY (retrieval_id) REFERENCES retrievals (id);')

  pgm.db.query('ALTER TABLE retrieval_orders DROP CONSTRAINT retrieval_orders_retrieval_id_fkey;')
  pgm.db.query('ALTER TABLE retrieval_orders ADD CONSTRAINT retrieval_orders_retrieval_collection_id_fkey FOREIGN KEY (retrieval_collection_id) REFERENCES retrieval_collections (id);')
}
