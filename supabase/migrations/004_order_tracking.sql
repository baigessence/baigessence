-- Order tracking / fulfillment status for COD orders

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'placed';

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS tracking_note TEXT;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_fulfillment_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_fulfillment_status_check
  CHECK (fulfillment_status IN (
    'placed',
    'confirmed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ));

UPDATE orders
SET fulfillment_status = 'placed'
WHERE fulfillment_status IS NULL OR fulfillment_status = '';

CREATE INDEX IF NOT EXISTS orders_fulfillment_status_idx
  ON orders (fulfillment_status);

CREATE INDEX IF NOT EXISTS orders_order_number_idx
  ON orders (order_number);
