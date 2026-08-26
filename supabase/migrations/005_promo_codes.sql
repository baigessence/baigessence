-- Promo codes (customer-entered % off at checkout)
-- Run in Supabase SQL Editor after 004_order_tracking.sql

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  percent_off INTEGER NOT NULL CHECK (percent_off > 0 AND percent_off <= 100),
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  max_redemptions INTEGER,
  redemption_count INTEGER NOT NULL DEFAULT 0 CHECK (redemption_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS promo_codes_code_idx ON promo_codes (code);
CREATE INDEX IF NOT EXISTS promo_codes_active_idx ON promo_codes (active);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages promo_codes" ON promo_codes;
CREATE POLICY "Service role manages promo_codes" ON promo_codes
  FOR ALL USING (false) WITH CHECK (false);

DROP TRIGGER IF EXISTS promo_codes_updated_at ON promo_codes;
CREATE TRIGGER promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Store applied promo on orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS promo_code TEXT;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0);
